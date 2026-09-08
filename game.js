import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import * as AudioEngine from './audio.js';
import { ParticleEngine } from './particles.js';
import { SpatialGrid } from './spatialGrid.js';
import { BotManager } from './botAI.js';
import { NetworkManager } from './network.js';

// ================= Scene Setup =================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e111d);
scene.fog = new THREE.FogExp2(0x0e111d, 0.009);

const DEFAULT_FOV = 75;
const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';
camera.position.set(-46, 2.0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.45;
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x75809c, 1.6);
scene.add(ambient);
const hemi = new THREE.HemisphereLight(0x90b4ea, 0x1c1e28, 1.4);
scene.add(hemi);

const moon = new THREE.DirectionalLight(0xd8e4ff, 2.4);
moon.position.set(90, 140, 60);
moon.castShadow = true;
scene.add(moon);

// ================= Systems =================
const spatialGrid = new SpatialGrid(12);
const particleEngine = new ParticleEngine(scene);

const HALF_W = 54;
const HALF_D = 44;

function heightAt(x, z) {
  const u = (x + HALF_W) / (HALF_W * 2);
  const v = (z + HALF_D) / (HALF_D * 2);
  const yNW = 0.0, ySW = -2.5, yNE = 2.0, ySE = 3.0;
  const topY = THREE.MathUtils.lerp(yNW, yNE, u);
  const botY = THREE.MathUtils.lerp(ySW, ySE, u);
  const baseH = THREE.MathUtils.lerp(topY, botY, v);
  return baseH + (Math.sin(x * 0.08) * 0.45 + Math.cos(z * 0.08) * 0.45);
}

// Procedural Arena Plane
const terrainGeo = new THREE.PlaneGeometry(HALF_W * 2 + 6, HALF_D * 2 + 6, 60, 50);
terrainGeo.rotateX(-Math.PI / 2);
const posAttr = terrainGeo.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
  posAttr.setY(i, heightAt(posAttr.getX(i), posAttr.getZ(i)));
}
terrainGeo.computeVertexNormals();
const terrainMesh = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ color: 0x141720, roughness: 0.4, metalness: 0.3 }));
terrainMesh.receiveShadow = true;
scene.add(terrainMesh);

function addObstacle(w, h, d, x, z, colorHex = 0x1a2233) {
  const y = heightAt(x, z) + h / 2;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 }));
  mesh.position.set(x, y, z);
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh);
  const col = { minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, top: y + h / 2, bottom: y - h / 2 };
  spatialGrid.addCollider(col);
}

// Perimeter Walls & Tactical Covers
addObstacle(HALF_W * 2 + 4, 30, 2, 0, -HALF_D - 1);
addObstacle(HALF_W * 2 + 4, 30, 2, 0, HALF_D + 1);
addObstacle(2, 30, HALF_D * 2 + 4, -HALF_W - 1, 0);
addObstacle(2, 30, HALF_D * 2 + 4, HALF_W + 1, 0);

// Base Complexes & Buildings
addObstacle(18, 28, 22, -40, -18, 0x1f2738);
addObstacle(16, 22, 20, -40, 20, 0x1f2738);
addObstacle(18, 28, 22, 40, 18, 0x2d241c);
addObstacle(16, 22, 20, 40, -20, 0x2d241c);
addObstacle(16, 26, 18, 0, 0, 0x111624);

// Urban Crates
addObstacle(4.0, 1.5, 2.5, -30, 0, 0x554422);
addObstacle(4.0, 1.5, 2.5, 30, 0, 0x554422);
addObstacle(5.0, 1.4, 2.0, -10, -10, 0x22382c);
addObstacle(5.0, 1.4, 2.0, 10, 10, 0x22382c);

// ================= Weapons & Loadouts =================
const WEAPONS = [
  { key: 'AR',      name: 'ASSAULT RIFLE // PULSE', damage: 24, fireDelay: 0.12, mag: 30, reserve: 90,  reload: 1.6, bulletSpeed: 80, spread: 0.016, pellets: 1, life: 2.0, fov: 45, scopeType: 'REDDOT' },
  { key: 'SMG',     name: 'SMG // VECTOR-X',         damage: 14, fireDelay: 0.08, mag: 25, reserve: 100, reload: 1.3, bulletSpeed: 75, spread: 0.030, pellets: 1, life: 1.5, fov: 50, scopeType: 'REDDOT' },
  { key: 'SHOTGUN', name: 'CYBER-SHOTGUN // SLAG',   damage: 16, fireDelay: 0.85, mag: 6,  reserve: 24,  reload: 2.2, bulletSpeed: 60, spread: 0.095, pellets: 8, life: 0.6, fov: 60, scopeType: 'NONE' },
  { key: 'SNIPER',  name: 'RAIL-SNIPER // APEX',     damage: 85, fireDelay: 1.4,  mag: 5,  reserve: 15,  reload: 2.8, bulletSpeed: 125, spread: 0.001, pellets: 1, life: 3.0, fov: 14, scopeType: 'SNIPER' }
];

let selectedLoadoutIndex = 0;
let currentWeaponIndex = 0;
const ammoState = WEAPONS.map(w => ({ mag: w.mag, reserve: w.reserve }));
let fireTimer = 0;
let reloading = false;
let reloadTimer = 0;
let isAiming = false;

const viewModelGroup = new THREE.Group();
camera.add(viewModelGroup);
scene.add(camera);

const gunGroup = new THREE.Group();
gunGroup.position.set(0.22, -0.28, -0.65);
viewModelGroup.add(gunGroup);

const NORMAL_GUN_POS = new THREE.Vector3(0.22, -0.28, -0.65);
const ADS_GUN_POS = new THREE.Vector3(0, -0.18, -0.45);

function buildGunMesh(w) {
  gunGroup.clear();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.75), new THREE.MeshStandardMaterial({ color: 0x223344 }));
  gunGroup.add(body);
}

function currentWeapon() { return WEAPONS[currentWeaponIndex]; }

// ================= Match State & UI =================
let myPlayerName = 'AGENT-' + Math.floor(Math.random() * 899 + 100);
let currentRoomCode = 'SECTOR-7';
let myTeam = 'RED';
let isMatchActive = false;
let isSoloMode = false;
let matchDuration = 600, timeRemaining = 600, gameMode = 'NORMAL';
let redScore = 0, blueScore = 0, personalKills = 0, personalDeaths = 0;

// Dash / Slide System
const DASH_DURATION = 0.5; // Fast tactical 0.5s slide
const DASH_COOLDOWN = 1.0;
let isDashing = false;
let dashTimeRemaining = 0, dashCooldownTimer = 0;
const dashDir = new THREE.Vector3();
const NORMAL_EYE_HEIGHT = 1.7;
const DASH_EYE_HEIGHT = 0.95;
let currentEyeHeight = NORMAL_EYE_HEIGHT;

const botManager = new BotManager(scene, particleEngine, (bot, dmg, killed, attackerName, attackerTeam) => {
  if (killed) {
    if (attackerTeam === 'RED') redScore++; else blueScore++;
    personalKills++;
    AudioEngine.playKillSound();
    document.getElementById('killfeed').innerHTML = `<div class="kill-item">${attackerName} 💥 ${bot.name}</div>`;
  }
});

// Event listener for bot damage to player
window.addEventListener('player-damaged-by-bot', (e) => {
  takeDamage(e.detail.dmg, e.detail.botName, e.detail.botTeam);
});

let health = 100;
const MAX_HEALTH = 100;
let lastDamageTime = -999;

function takeDamage(amount, attackerName = 'SYSTEM', attackerTeam = null) {
  if (!isMatchActive || health <= 0 || (attackerTeam && attackerTeam === myTeam)) return;
  health = Math.max(0, health - amount);
  lastDamageTime = performance.now() / 1000;
  document.getElementById('healthBar').style.width = (health / MAX_HEALTH * 100) + '%';
  particleEngine.addScreenShake(0.04);

  if (health <= 0) {
    personalDeaths++;
    if (attackerTeam === 'RED') redScore++; else blueScore++;
    triggerRespawn();
  }
}

function triggerRespawn() {
  isMatchActive = false;
  document.getElementById('respawnModal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('respawnModal').style.display = 'none';
    health = MAX_HEALTH;
    document.getElementById('healthBar').style.width = '100%';
    isMatchActive = true;
    camera.position.set(myTeam === 'RED' ? -46 : 46, heightAt(-46, 0) + 1.7, 0);
  }, 3000);
}

// ================= Input & Multi-Touch Controls =================
const controls = new PointerLockControls(camera, document.body);
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (isTouchDevice) document.body.classList.add('touch-device');

const move = { forward: false, back: false, left: false, right: false };
const velocity = new THREE.Vector3();
let verticalVelocity = 0, isGrounded = true;
let joystickVector = { x: 0, y: 0 };

document.addEventListener('keydown', (e) => {
  if (!isMatchActive) return;
  switch (e.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.back = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'ShiftLeft':
    case 'ShiftRight':
      triggerSlide();
      break;
    case 'KeyR': startReload(); break;
    case 'Space': if (isGrounded) { verticalVelocity = 9.2; isGrounded = false; } break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.back = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
  }
});

function triggerSlide() {
  if (!isMatchActive || isDashing || dashCooldownTimer > 0) return;
  const fwd = new THREE.Vector3();
  camera.getWorldDirection(fwd);
  fwd.y = 0; fwd.normalize();
  dashDir.copy(fwd);
  isDashing = true;
  dashTimeRemaining = DASH_DURATION;
  AudioEngine.playSlideWhoosh();
}

// Bullets
const bullets = [];
function tryShoot() {
  if (!isMatchActive || reloading || fireTimer > 0) return;
  const w = currentWeapon();
  const state = ammoState[currentWeaponIndex];
  if (state.mag <= 0) { startReload(); return; }

  state.mag--;
  fireTimer = w.fireDelay;
  AudioEngine.playGunshot(w.key, true);
  particleEngine.spawnMuzzleFlash(gunGroup);
  particleEngine.addScreenShake(0.015);

  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  bullets.push({ pos: camera.position.clone(), vel: dir.multiplyScalar(w.bulletSpeed), life: w.life, dmg: w.damage });
}

function startReload() {
  if (reloading) return;
  reloading = true;
  reloadTimer = currentWeapon().reload;
  AudioEngine.playReload();
  document.getElementById('reloadMsg').style.opacity = '1';
}

// ================= Game Loop =================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  // Dash updates
  if (isDashing) {
    dashTimeRemaining -= delta;
    currentEyeHeight = THREE.MathUtils.lerp(currentEyeHeight, DASH_EYE_HEIGHT, delta * 14);
    if (dashTimeRemaining <= 0) {
      isDashing = false;
      dashCooldownTimer = DASH_COOLDOWN;
    }
  } else {
    currentEyeHeight = THREE.MathUtils.lerp(currentEyeHeight, NORMAL_EYE_HEIGHT, delta * 10);
    if (dashCooldownTimer > 0) dashCooldownTimer -= delta;
  }

  // Reload timer
  if (reloading) {
    reloadTimer -= delta;
    if (reloadTimer <= 0) {
      reloading = false;
      ammoState[currentWeaponIndex].mag = currentWeapon().mag;
      document.getElementById('reloadMsg').style.opacity = '0';
    }
  }

  if (fireTimer > 0) fireTimer -= delta;

  // Particle Engine & Shake
  particleEngine.update(delta);
  const shake = particleEngine.getScreenShakeOffset();
  camera.rotation.x += shake.x;
  camera.rotation.y += shake.y;

  // Movement & Spatial Collision
  if (isMatchActive && (controls.isLocked || isTouchDevice)) {
    let speed = (isDashing ? 16 : 8.5) * (isAiming ? 0.6 : 1.0);
    velocity.set(0, 0, 0);

    if (isDashing) {
      velocity.copy(dashDir).multiplyScalar(speed * delta);
    } else {
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0; forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

      velocity.addScaledVector(forward, ((move.forward ? 1 : 0) - (move.back ? 1 : 0)) + joystickVector.y);
      velocity.addScaledVector(right, ((move.right ? 1 : 0) - (move.left ? 1 : 0)) + joystickVector.x);
      if (velocity.lengthSq() > 0) velocity.normalize().multiplyScalar(speed * delta);
    }

    const nextPos = camera.position.clone().add(velocity);
    const nearbyCols = spatialGrid.query(nextPos.x, nextPos.z, 3);
    let blocked = false;
    for (const c of nearbyCols) {
      if (nextPos.x >= c.minX && nextPos.x <= c.maxX && nextPos.z >= c.minZ && nextPos.z <= c.maxZ) {
        blocked = true; break;
      }
    }
    if (!blocked) camera.position.copy(nextPos);

    // Height calculation
    const groundY = heightAt(camera.position.x, camera.position.z) + currentEyeHeight;
    verticalVelocity -= 22 * delta;
    camera.position.y += verticalVelocity * delta;
    if (camera.position.y <= groundY) {
      camera.position.y = groundY;
      verticalVelocity = 0;
      isGrounded = true;
    }
  }

  // Update Bots
  botManager.update(delta, camera.position, myTeam, heightAt);

  // Bullets Simulation & Hit checks
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.pos.addScaledVector(b.vel, delta);
    b.life -= delta;

    // Check bots hit
    for (const bot of botManager.bots) {
      if (!bot.isDead && b.pos.distanceTo(bot.mesh.position.clone().add(new THREE.Vector3(0, 1.1, 0))) < 1.1) {
        AudioEngine.playHitmarker();
        botManager.damageBot(bot, b.dmg, myPlayerName, myTeam);
        b.life = 0;
        break;
      }
    }

    if (b.life <= 0) bullets.splice(i, 1);
  }

  // Update HUD
  document.getElementById('ammoMag').textContent = ammoState[currentWeaponIndex].mag;
  document.getElementById('ammoReserve').textContent = ammoState[currentWeaponIndex].reserve;
  document.getElementById('weaponName').textContent = currentWeapon().name;

  renderer.render(scene, camera);
}

// Modal Entry
document.getElementById('enterLobbyBtn').addEventListener('click', () => {
  AudioEngine.getAudioContext();
  document.getElementById('entryModal').style.display = 'none';
  document.getElementById('lobbyModal').style.display = 'flex';
});

document.getElementById('soloLobbyBtn').addEventListener('click', () => {
  AudioEngine.getAudioContext();
  isSoloMode = true;
  document.getElementById('entryModal').style.display = 'none';
  document.getElementById('lobbyModal').style.display = 'flex';
  botManager.spawnBot('TITAN-01', 'BLUE', new THREE.Vector3(20, heightAt(20, 0), 0));
  botManager.spawnBot('TITAN-02', 'BLUE', new THREE.Vector3(30, heightAt(30, 10), 10));
});

document.getElementById('startMatchBtn').addEventListener('click', () => {
  document.getElementById('lobbyModal').style.display = 'none';
  isMatchActive = true;
  buildGunMesh(currentWeapon());
  if (!isTouchDevice) controls.lock();
});

document.addEventListener('mousedown', (e) => {
  if (!isMatchActive) return;
  if (e.button === 0) tryShoot();
});

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
