import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

window.addEventListener('contextmenu', e => e.preventDefault());

// ================= Procedural Textures =================
function createHazardCrateTexture(text = 'SUPPLY // 07', baseColor = '#5c4322', accentColor = '#ffbb00') {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = baseColor; ctx.fillRect(0, 0, 512, 512);

  const plankH = 512 / 5;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#48351b' : '#694e2a';
    ctx.fillRect(0, i * plankH, 512, plankH);
    ctx.strokeStyle = '#221609'; ctx.lineWidth = 4;
    ctx.strokeRect(0, i * plankH, 512, plankH);
  }

  ctx.fillStyle = '#20242e';
  ctx.fillRect(0, 0, 512, 32); ctx.fillRect(0, 512 - 32, 512, 32);
  ctx.fillRect(0, 0, 32, 512); ctx.fillRect(512 - 32, 0, 32, 512);

  ctx.strokeStyle = '#20242e'; ctx.lineWidth = 28;
  ctx.beginPath(); ctx.moveTo(32, 32); ctx.lineTo(512 - 32, 512 - 32); ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.fillRect(120, 215, 272, 82);
  ctx.fillStyle = '#11131a'; ctx.font = 'bold 24px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, 264);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createContainerTexture(label = 'MAERSK-CYBER', colorHex = '#1a3b5c', accentHex = '#00e5ff') {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = colorHex; ctx.fillRect(0, 0, 512, 256);

  for (let x = 0; x < 512; x += 16) {
    ctx.fillStyle = '#0a101d'; ctx.fillRect(x, 0, 4, 256);
    ctx.fillStyle = '#3a506d'; ctx.fillRect(x + 4, 0, 4, 256);
  }
  ctx.fillStyle = '#05070d';
  ctx.fillRect(0, 0, 512, 16); ctx.fillRect(0, 240, 512, 16);
  ctx.fillRect(0, 0, 16, 256); ctx.fillRect(496, 0, 16, 256);

  ctx.fillStyle = accentHex;
  ctx.font = 'bold 36px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText(label, 256, 140);

  return new THREE.CanvasTexture(canvas);
}

function createCyberRoadTexture(accentColorHex, asphaltColor = '#171a24') {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = asphaltColor; ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#222834'; ctx.lineWidth = 2;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let y = 0; y < 512; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  ctx.fillStyle = accentColorHex;
  ctx.fillRect(8, 0, 8, 512); ctx.fillRect(512 - 16, 0, 8, 512);
  for (let y = 20; y < 512; y += 70) {
    ctx.fillRect(252, y, 8, 35);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createBuildingFacadeTexture(baseColorHex, litColorHex, density = 0.6) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = baseColorHex; ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#080a10'; ctx.lineWidth = 3;
  for (let y = 0; y <= 512; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
  for (let x = 0; x <= 512; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(512, y); ctx.stroke(); }

  const winW = 28, winH = 20;
  for (let y = 14; y < 512; y += 48) {
    for (let x = 10; x < 512; x += 48) {
      const rand = Math.random();
      if (rand < density) {
        ctx.fillStyle = (rand < density * 0.45) ? litColorHex : (rand < density * 0.75 ? '#00e5ff' : '#ffaa00');
      } else {
        ctx.fillStyle = '#0e121a';
      }
      ctx.fillRect(x, y, winW, winH);
      ctx.strokeStyle = '#040608'; ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, winW, winH);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createNeonSignTexture(text, subtext, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#090c14'; ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = colorHex; ctx.lineWidth = 8; ctx.strokeRect(12, 12, 488, 232);
  ctx.fillStyle = colorHex; ctx.font = 'bold 38px Courier New'; ctx.textAlign = 'center'; ctx.fillText(text, 256, 110);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px Courier New'; ctx.fillText(subtext, 256, 160);
  return new THREE.CanvasTexture(canvas);
}

const woodCrateTex = createHazardCrateTexture('CARGO // 01', '#583f21', '#ffaa00');
const bunkerCrateTex = createHazardCrateTexture('ARMORY // 02', '#22382c', '#00ff88');
const containerBlueTex = createContainerTexture('KENDACHI-LOGISTICS', '#102238', '#00e5ff');
const containerRedTex = createContainerTexture('NIGHTCORP-FREIGHT', '#38101a', '#ff3355');

const texDarkSlate = createBuildingFacadeTexture('#121622', '#00e5ff', 0.65);
const texDarkGold = createBuildingFacadeTexture('#1f1a10', '#ffcc00', 0.65);
const texDarkMaroon = createBuildingFacadeTexture('#22121c', '#ff2bd6', 0.6);
const texDarkForest = createBuildingFacadeTexture('#101c15', '#00ff88', 0.55);
const texDarkObsidian = createBuildingFacadeTexture('#0f1118', '#00e5ff', 0.7);

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
moon.shadow.mapSize.set(2048, 2048);
moon.shadow.camera.left = -90;
moon.shadow.camera.right = 90;
moon.shadow.camera.top = 90;
moon.shadow.camera.bottom = -90;
scene.add(moon);

function addNeonPoint(color, x, y, z, intensity, dist) {
  const light = new THREE.PointLight(color, intensity, dist);
  light.position.set(x, y, z);
  scene.add(light);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color }));
  bulb.position.copy(light.position);
  scene.add(bulb);
  return light;
}

addNeonPoint(0xff3355, -42, 10, -15, 6.0, 70);
addNeonPoint(0x00e5ff, 42, 10, 15, 6.0, 70);
addNeonPoint(0xff2bd6, 0, 12, 0, 6.5, 75);
addNeonPoint(0xffdd00, 0, 10, -30, 5.0, 60);
addNeonPoint(0x00ff88, 0, 10, 30, 5.0, 60);
addNeonPoint(0x00e5ff, -22, 8, -26, 4.5, 50);
addNeonPoint(0xff2bd6, 22, 8, 26, 4.5, 50);

// ================= Arena Architecture =================
const HALF_W = 54;
const HALF_D = 44;
const colliders = [];

function addCollider(x, y, z, w, h, d) {
  colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, top: y + h / 2, bottom: y - h / 2 });
}

function heightAt(x, z) {
  const u = (x + HALF_W) / (HALF_W * 2);
  const v = (z + HALF_D) / (HALF_D * 2);

  const yNW = 0.0, ySW = -2.5, yNE = 2.0, ySE = 3.0;
  const topY = THREE.MathUtils.lerp(yNW, yNE, u);
  const botY = THREE.MathUtils.lerp(ySW, ySE, u);
  let baseH = THREE.MathUtils.lerp(topY, botY, v);

  const wave = Math.sin(x * 0.08) * 0.45 + Math.cos(z * 0.08) * 0.45;
  return baseH + wave;
}

const terrainGeo = new THREE.PlaneGeometry(HALF_W * 2 + 6, HALF_D * 2 + 6, 80, 70);
terrainGeo.rotateX(-Math.PI / 2);
const posAttr = terrainGeo.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
  const vx = posAttr.getX(i);
  const vz = posAttr.getZ(i);
  posAttr.setY(i, heightAt(vx, vz));
}
terrainGeo.computeVertexNormals();

const masterRoadTex = createCyberRoadTexture('#00e5ff', '#141720');
masterRoadTex.repeat.set(16, 14);
const terrainMesh = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ 
  map: masterRoadTex, roughness: 0.35, metalness: 0.4 
}));
terrainMesh.receiveShadow = true;
scene.add(terrainMesh);

function addPerimeterWall(w, h, d, x, y, z) {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x121622, roughness: 0.85, metalness: 0.2 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  scene.add(mesh);
  addCollider(x, y, z, w, h, d);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(w > 1 ? w : 0.4, 0.5, d > 1 ? d : 0.4), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
  trim.position.set(x, y + h / 2 + 0.25, z);
  scene.add(trim);
}
addPerimeterWall(HALF_W * 2 + 4, 30, 2, 0, 10, -HALF_D - 1);
addPerimeterWall(HALF_W * 2 + 4, 30, 2, 0, 10, HALF_D + 1);
addPerimeterWall(2, 30, HALF_D * 2 + 4, -HALF_W - 1, 10, 0);
addPerimeterWall(2, 30, HALF_D * 2 + 4, HALF_W + 1, 10, 0);

function addFoundation(w, d, x, z, bottomH = -16) {
  const midY = (heightAt(x, z) + bottomH) / 2;
  const skirtH = Math.abs(heightAt(x, z) - bottomH) + 2;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, skirtH, d), new THREE.MeshStandardMaterial({ color: 0x090b10, roughness: 0.9 }));
  mesh.position.set(x, midY, z);
  mesh.receiveShadow = true;
  scene.add(mesh);
  addCollider(x, midY, z, w, skirtH, d);
}

function addDenseBuilding(w, h, d, x, z, mat, roofTrimColor = 0x00e5ff) {
  const baseY = heightAt(x, z);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, baseY + h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  addCollider(x, baseY + h / 2, z, w, h, d);
  addFoundation(w + 0.2, d + 0.2, x, z, baseY - 16);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.4, d + 0.2), new THREE.MeshBasicMaterial({ color: roofTrimColor }));
  trim.position.set(x, baseY + h + 0.2, z);
  scene.add(trim);
  return mesh;
}

function addNeonBillboard(x, y, z, w, h, text, subtext, colorHex, rotY = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: createNeonSignTexture(text, subtext, colorHex), side: THREE.DoubleSide }));
  mesh.position.set(x, y, z); mesh.rotation.y = rotY;
  scene.add(mesh);
}

const concreteCoverMat = new THREE.MeshStandardMaterial({ map: bunkerCrateTex, roughness: 0.6, metalness: 0.4 });
const woodCoverMat = new THREE.MeshStandardMaterial({ map: woodCrateTex, roughness: 0.7, metalness: 0.3 });
const containerBlueMat = new THREE.MeshStandardMaterial({ map: containerBlueTex, roughness: 0.5, metalness: 0.5 });
const containerRedMat = new THREE.MeshStandardMaterial({ map: containerRedTex, roughness: 0.5, metalness: 0.5 });

function addCoverObject(w, h, d, x, z, mat = woodCoverMat) {
  const y = heightAt(x, z);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y + h / 2, z);
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh);
  addCollider(x, y + h / 2, z, w, h, d);
  addFoundation(w + 0.1, d + 0.1, x, z, y - 4);
  return mesh;
}

function addWaterCoolantTower(x, z, radius = 3.6, tankH = 5.5, legH = 7.0, accentHex = 0x00e5ff) {
  const baseY = heightAt(x, z);
  const group = new THREE.Group();
  group.position.set(x, baseY, z);

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x2b3445, metalness: 0.85, roughness: 0.3 });
  const darkLegMat = new THREE.MeshStandardMaterial({ color: 0x181e2b, metalness: 0.9, roughness: 0.4 });

  const legOffset = radius * 0.75;
  const legGeo = new THREE.CylinderGeometry(0.3, 0.4, legH, 8);
  const legPositions = [[-legOffset, -legOffset], [legOffset, -legOffset], [-legOffset, legOffset], [legOffset, legOffset]];

  legPositions.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, darkLegMat);
    leg.position.set(lx, legH / 2, lz);
    leg.castShadow = true;
    group.add(leg);
    addCollider(x + lx, baseY + legH / 2, z + lz, 0.8, legH, 0.8);
  });

  const tank = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, tankH, 20), metalMat);
  tank.position.y = legH + tankH / 2;
  tank.castShadow = true;
  group.add(tank);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), metalMat);
  dome.position.y = legH + tankH;
  group.add(dome);

  const glowRing = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.12, 0.2, 8, 20), new THREE.MeshBasicMaterial({ color: accentHex }));
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.y = legH + tankH * 0.5;
  group.add(glowRing);

  addCollider(x, baseY + legH + tankH / 2, z, radius * 2, tankH, radius * 2);
  addFoundation(radius * 2, radius * 2, x, z, baseY - 4);
  scene.add(group);
}

let holoGemMesh = null;
function addHoloPlaza(x, z) {
  const baseY = heightAt(x, z);
  const group = new THREE.Group();
  group.position.set(x, baseY, z);

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x171d2b, roughness: 0.5, metalness: 0.5 });
  const step1 = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.5, 0.6, 8), baseMat); step1.position.y = 0.3;
  group.add(step1);

  const projRing = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.15, 8, 20), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
  projRing.rotation.x = Math.PI / 2; projRing.position.y = 0.65;
  group.add(projRing);

  holoGemMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 0), new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true }));
  holoGemMesh.position.y = 2.4;
  group.add(holoGemMesh);

  scene.add(group);
  addCollider(x, baseY + 0.3, z, 7.0, 0.8, 7.0);
  addFoundation(7.5, 7.5, x, z, baseY - 4);
}

// Buildings & Props
addDenseBuilding(18, 28, 22, -40, -18, new THREE.MeshStandardMaterial({ map: texDarkSlate, roughness: 0.35, metalness: 0.6 }), 0xff3355);
addNeonBillboard(-30.9, heightAt(-30.9, -18) + 12, -18, 16, 5, 'NIGHT CORP // 07', 'RED SQUAD COMMAND', '#ff3355', Math.PI / 2);

addDenseBuilding(16, 22, 20, -40, 20, new THREE.MeshStandardMaterial({ map: texDarkForest, roughness: 0.4 }), 0xff3355);
addNeonBillboard(-31.9, heightAt(-31.9, 20) + 10, 20, 14, 4.5, 'REACTOR SUB-01', 'WEAPONS DEPOT', '#ff3355', Math.PI / 2);

addDenseBuilding(18, 28, 22, 40, 18, new THREE.MeshStandardMaterial({ map: texDarkGold, roughness: 0.35, metalness: 0.65 }), 0x00e5ff);
addNeonBillboard(30.9, heightAt(30.9, 18) + 12, 18, 16, 5, 'KENDACHI DATA', 'BLUE SQUAD COMMAND', '#00e5ff', -Math.PI / 2);

addDenseBuilding(16, 22, 20, 40, -20, new THREE.MeshStandardMaterial({ map: texDarkMaroon, roughness: 0.35, metalness: 0.7 }), 0x00e5ff);
addNeonBillboard(31.9, heightAt(31.9, -20) + 10, -20, 14, 4.5, 'ARASAKA UPLINK', 'TACTICAL COMMS', '#00e5ff', -Math.PI / 2);

addDenseBuilding(16, 26, 18, 0, 0, new THREE.MeshStandardMaterial({ map: texDarkObsidian, roughness: 0.3, metalness: 0.7 }), 0xff2bd6);
addNeonBillboard(0, heightAt(0, -9.1) + 12, -9.1, 14, 4.5, 'SECTOR CENTRAL', 'TACTICAL CHOKEPOINT', '#ff2bd6', 0);
addNeonBillboard(0, heightAt(0, 9.1) + 12, 9.1, 14, 4.5, 'CYBER DISTRICT', 'STREET ACCESS', '#ff2bd6', Math.PI);

addDenseBuilding(24, 20, 14, 0, -34, new THREE.MeshStandardMaterial({ map: texDarkGold, roughness: 0.4 }), 0xffdd00);
addNeonBillboard(0, heightAt(0, -26.9) + 9, -26.9, 18, 4.5, 'NEXUS RESEARCH', 'BIO-TECH DIV', '#ffdd00', 0);

addDenseBuilding(24, 20, 14, 0, 34, new THREE.MeshStandardMaterial({ map: texDarkForest, roughness: 0.4 }), 0x00ff88);
addNeonBillboard(0, heightAt(0, 26.9) + 9, 26.9, 18, 4.5, 'TRANSIT DEPOT', 'CARGO ACCESS', '#00ff88', Math.PI);

addWaterCoolantTower(-22, -26, 3.4, 5.0, 6.5, 0x00e5ff);
addWaterCoolantTower(22, 26, 3.4, 5.0, 6.5, 0xff2bd6);
addHoloPlaza(-18, 20);
addHoloPlaza(18, -20);

addCoverObject(3.2, 3.0, 7.5, -20, -5, containerRedMat);
addCoverObject(3.2, 3.0, 7.5, 20, 5, containerBlueMat);
addCoverObject(7.5, 3.0, 3.2, -18, -14, containerRedMat);
addCoverObject(7.5, 3.0, 3.2, 18, 14, containerBlueMat);

addCoverObject(5.0, 1.4, 2.0, -10, -10, concreteCoverMat);
addCoverObject(5.0, 1.4, 2.0, 10, 10, concreteCoverMat);
addCoverObject(2.0, 1.4, 5.0, -10, 10, concreteCoverMat);
addCoverObject(2.0, 1.4, 5.0, 10, -10, concreteCoverMat);
addCoverObject(4.0, 1.5, 2.5, -30, 0, woodCoverMat);
addCoverObject(4.0, 1.5, 2.5, 30, 0, woodCoverMat);
addCoverObject(3.0, 1.4, 3.0, 0, -18, woodCoverMat);
addCoverObject(3.0, 1.4, 3.0, 0, 18, woodCoverMat);
addCoverObject(2.0, 1.3, 4.0, -28, 26, concreteCoverMat);
addCoverObject(2.0, 1.3, 4.0, 28, -26, concreteCoverMat);
addCoverObject(4.0, 1.4, 2.0, -24, -36, woodCoverMat);
addCoverObject(4.0, 1.4, 2.0, 24, 36, woodCoverMat);

// ================= Weapons & Loadouts =================
const WEAPONS = [
  { key: 'AR',      name: 'ASSAULT RIFLE // PULSE', damage: 24, fireDelay: 0.12, mag: 30, reserve: 90,  reload: 1.6, bulletSpeed: 80, spread: 0.016, pellets: 1, life: 2.0, color: 0x333b4d, fov: 45, scopeType: 'REDDOT', recoilKick: 0.014, recoilSide: 0.008 },
  { key: 'SMG',     name: 'SMG // VECTOR-X',         damage: 14, fireDelay: 0.08, mag: 25, reserve: 100, reload: 1.3, bulletSpeed: 75, spread: 0.030, pellets: 1, life: 1.5, color: 0x223c58, fov: 50, scopeType: 'REDDOT', recoilKick: 0.010, recoilSide: 0.013 },
  { key: 'SHOTGUN', name: 'CYBER-SHOTGUN // SLAG',   damage: 16, fireDelay: 0.85, mag: 6,  reserve: 24,  reload: 2.2, bulletSpeed: 60, spread: 0.095, pellets: 8, life: 0.6, color: 0x543220, fov: 60, scopeType: 'NONE', recoilKick: 0.045, recoilSide: 0.018 },
  { key: 'SNIPER',  name: 'RAIL-SNIPER // APEX',     damage: 85, fireDelay: 1.4,  mag: 5,  reserve: 15,  reload: 2.8, bulletSpeed: 125, spread: 0.001, pellets: 1, life: 3.0, color: 0x1e222a, fov: 14, scopeType: 'SNIPER', recoilKick: 0.065, recoilSide: 0.006 },
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

const armMat = new THREE.MeshStandardMaterial({ color: 0x222634, roughness: 0.5, metalness: 0.4 });
const armTrigger = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.5), armMat);
const armSupport = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.5), armMat);
armTrigger.position.set(0.16, -0.30, -0.55);
armSupport.position.set(0.10, -0.22, -0.95);
viewModelGroup.add(armTrigger, armSupport);

const gunGroup = new THREE.Group();
gunGroup.position.set(0.22, -0.28, -0.65);
viewModelGroup.add(gunGroup);

const NORMAL_GUN_POS = new THREE.Vector3(0.22, -0.28, -0.65);
const ADS_GUN_POS = new THREE.Vector3(0, -0.18, -0.45);

function buildGunMesh(weapon) {
  gunGroup.clear();
  const mat = new THREE.MeshStandardMaterial({ color: weapon.color, metalness: 0.8, roughness: 0.2 });
  if (weapon.key === 'AR') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.75), mat);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.02, 0.6), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.08), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
    strip.position.set(0, 0.05, 0); sight.position.set(0, 0.08, -0.1);
    gunGroup.add(body, strip, sight);
  } else if (weapon.key === 'SMG') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.5), mat);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.02, 0.35), new THREE.MeshBasicMaterial({ color: 0xff2bd6 }));
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.06), new THREE.MeshBasicMaterial({ color: 0xff2bd6 }));
    strip.position.set(0, 0.06, 0); sight.position.set(0, 0.09, -0.05);
    gunGroup.add(body, strip, sight);
  } else if (weapon.key === 'SHOTGUN') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.7), mat);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), mat);
    barrel.rotation.x = Math.PI / 2; barrel.position.z = -0.2;
    gunGroup.add(body, barrel);
  } else if (weapon.key === 'SNIPER') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.95), mat);
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 }));
    scope.rotation.x = Math.PI / 2; scope.position.set(0, 0.09, -0.1);
    gunGroup.add(body, scope);
  }
}

function currentWeapon() { return WEAPONS[currentWeaponIndex]; }

const scopeOverlayEl = document.getElementById('scopeOverlay');
const crosshairEl = document.getElementById('crosshair');
const crosshairCenterEl = document.getElementById('crosshair-center');

function setAimState(aiming) {
  isAiming = aiming;
  const w = currentWeapon();
  scopeOverlayEl.className = '';
  
  if (isAiming) {
    if (w.scopeType === 'SNIPER') {
      scopeOverlayEl.className = 'scope-sniper active';
      scopeOverlayEl.innerHTML = '<div class="sniper-reticle"></div>';
      crosshairEl.style.opacity = '0';
      crosshairCenterEl.style.opacity = '0';
      viewModelGroup.visible = false;
    } else if (w.scopeType === 'REDDOT') {
      scopeOverlayEl.className = 'scope-reddot active';
      scopeOverlayEl.innerHTML = '<div class="reddot-reticle"></div>';
      crosshairEl.style.opacity = '0';
      crosshairCenterEl.style.opacity = '0';
      viewModelGroup.visible = true;
    } else {
      crosshairEl.style.opacity = '0.3';
      crosshairCenterEl.style.opacity = '0.3';
      viewModelGroup.visible = true;
    }
  } else {
    crosshairEl.style.opacity = '1';
    crosshairCenterEl.style.opacity = '1';
    viewModelGroup.visible = true;
  }
}

function applySelectedLoadout() {
  currentWeaponIndex = selectedLoadoutIndex;
  const w = currentWeapon();
  ammoState[currentWeaponIndex].mag = w.mag;
  ammoState[currentWeaponIndex].reserve = w.reserve;
  buildGunMesh(w);
  updateWeaponHud();
}

// ================= Game Stats & Telemetry =================
let myPlayerName = 'AGENT-' + Math.floor(Math.random() * 899 + 100);
let currentRoomCode = 'SECTOR-7';
let myTeam = 'RED';
let isMatchActive = false;
let isSoloMode = false;

let matchDuration = 600;
let timeRemaining = 600;
let gameMode = 'NORMAL';

let redScore = 0;
let blueScore = 0;
let personalKills = 0;
let personalDeaths = 0;

// Dash / Slide System State
const DASH_DURATION = 0.5;
const DASH_COOLDOWN = 1.2;
let isDashing = false;
let dashTimeRemaining = 0;
let dashCooldownTimer = 0;
const dashDir = new THREE.Vector3();
const NORMAL_EYE_HEIGHT = 1.7;
const DASH_EYE_HEIGHT = 0.95;
let currentEyeHeight = NORMAL_EYE_HEIGHT;

const hudMyTeamEl = document.getElementById('hudMyTeam');
const redScoreEl = document.getElementById('redScore');
const blueScoreEl = document.getElementById('blueScore');
const timerBadgeEl = document.getElementById('timer-badge');
const hudModeNameEl = document.getElementById('hudModeName');
const hudKillsEl = document.getElementById('hudKills');
const hudDeathsEl = document.getElementById('hudDeaths');
const hudKDEl = document.getElementById('hudKD');
const voiceSpeakerTabsEl = document.getElementById('voiceSpeakerTabs');
const micHudToggle = document.getElementById('micHudToggle');
const micHudIcon = document.getElementById('micHudIcon');
const micHudLabel = document.getElementById('micHudLabel');
const micTouchBtn = document.getElementById('micTouchBtn');
const dashBarEl = document.getElementById('dashBar');

const redTeamListEl = document.getElementById('redTeamList');
const blueTeamListEl = document.getElementById('blueTeamList');

const entryModal = document.getElementById('entryModal');
const lobbyModal = document.getElementById('lobbyModal');
const respawnModal = document.getElementById('respawnModal');
const endGameModal = document.getElementById('endGameModal');

const enterLobbyBtn = document.getElementById('enterLobbyBtn');
const soloLobbyBtn = document.getElementById('soloLobbyBtn');
const startMatchBtn = document.getElementById('startMatchBtn');
const returnLobbyBtn = document.getElementById('returnLobbyBtn');
const joinRedBtn = document.getElementById('joinRedBtn');
const joinBlueBtn = document.getElementById('joinBlueBtn');

const timeSelect = document.getElementById('timeSelect');
const modeSelect = document.getElementById('modeSelect');
const hostConfigRow = document.getElementById('hostConfigRow');
const clientWaitMsg = document.getElementById('clientWaitMsg');
const lobbyRoomTitle = document.getElementById('lobbyRoomTitle');
const lobbyRoleTitle = document.getElementById('lobbyRoleTitle');

const killfeedEl = document.getElementById('killfeed');
const healthBarEl = document.getElementById('healthBar');
const weaponNameEl = document.getElementById('weaponName');
const ammoMagEl = document.getElementById('ammoMag');
const ammoReserveEl = document.getElementById('ammoReserve');
const reloadMsgEl = document.getElementById('reloadMsg');
const slots = [document.getElementById('slot0'), document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];

function updateScoreboard() {
  redScoreEl.textContent = redScore;
  blueScoreEl.textContent = blueScore;
  const mins = Math.floor(Math.max(0, timeRemaining) / 60);
  const secs = Math.floor(Math.max(0, timeRemaining) % 60);
  timerBadgeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  hudKillsEl.textContent = personalKills;
  hudDeathsEl.textContent = personalDeaths;
  hudKDEl.textContent = (personalKills / Math.max(1, personalDeaths)).toFixed(2);
}

function updateWeaponHud() {
  const w = currentWeapon();
  const state = ammoState[currentWeaponIndex];
  weaponNameEl.textContent = w.name;
  ammoMagEl.textContent = gameMode === 'NOAMMO' ? '∞' : state.mag;
  ammoReserveEl.textContent = gameMode === 'NOAMMO' ? '∞' : state.reserve;
  slots.forEach((s, i) => s.classList.toggle('active', i === currentWeaponIndex));
}

function setupLoadoutPicker(containerId) {
  const cards = document.querySelectorAll(`#${containerId} .weapon-card`);
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedLoadoutIndex = parseInt(card.dataset.widx);
      if (!isMatchActive) applySelectedLoadout();
    });
  });
}
setupLoadoutPicker('lobbyLoadoutPicker');
setupLoadoutPicker('respawnLoadoutPicker');

// ================= Trigger Slide / Dash =================
function triggerSlideDash() {
  if (!isMatchActive || isDashing || dashCooldownTimer > 0 || health <= 0) return;

  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0; forward.normalize();
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

  const forwardInput = ((move.forward ? 1 : 0) - (move.back ? 1 : 0)) + joystickVector.y;
  const rightInput = ((move.right ? 1 : 0) - (move.left ? 1 : 0)) + joystickVector.x;

  dashDir.set(0, 0, 0);
  dashDir.addScaledVector(forward, forwardInput !== 0 ? forwardInput : 1);
  dashDir.addScaledVector(right, rightInput);
  if (dashDir.lengthSq() === 0) dashDir.copy(forward);
  dashDir.normalize();

  isDashing = true;
  dashTimeRemaining = DASH_DURATION;
  if (isAiming) setAimState(false);
}

// ================= Cross-Platform 75m WebRTC Proximity Voice Chat =================
let voiceAudioCtx = null;
let localVoiceStream = null;
let localVoiceSource = null;
let localAnalyser = null;
let isMicMuted = false;
let localIsSpeaking = false;

const remoteVoices = new Map();
const pendingVoiceCalls = new Set();
const MAX_PROXIMITY_DIST = 75;
const MIN_PROXIMITY_DIST = 3.0;

// STUN/TURN Config with robust fallback for Mobile Cellular <-> Broadband PC Crossplay
const PEER_CONFIG = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.relay.metered.ca:80' },
      {
        urls: [
          'turn:eu-0.turn.peerjs.com:3478',
          'turn:us-0.turn.peerjs.com:3478'
        ],
        username: 'peerjs',
        credential: 'peerjsp'
      }
    ],
    sdpSemantics: 'unified-plan'
  }
};

function getOrCreateAudioContext() {
  if (!voiceAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    voiceAudioCtx = new AudioContextClass({ latencyHint: 'interactive' });
  }
  if (voiceAudioCtx.state === 'suspended') {
    voiceAudioCtx.resume().catch(() => {});
  }
  return voiceAudioCtx;
}

// Mobile Web Audio unlock listener
window.addEventListener('touchstart', () => getOrCreateAudioContext(), { once: false, passive: true });
window.addEventListener('pointerdown', () => getOrCreateAudioContext(), { once: false, passive: true });

function createSilentFallbackStream() {
  const ctx = getOrCreateAudioContext();
  const osc = ctx.createOscillator();
  const dst = ctx.createMediaStreamDestination();
  const gain = ctx.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(dst);
  osc.start();
  return dst.stream;
}

async function initProximityMic() {
  getOrCreateAudioContext();
  if (localVoiceStream) return localVoiceStream;

  try {
    localVoiceStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    });
  } catch (err) {
    console.warn('Microphone access denied or unavailable. Fallback audio active.', err);
    localVoiceStream = createSilentFallbackStream();
    isMicMuted = true;
  }

  try {
    localVoiceSource = voiceAudioCtx.createMediaStreamSource(localVoiceStream);
    localAnalyser = voiceAudioCtx.createAnalyser();
    localAnalyser.fftSize = 256;
    localAnalyser.smoothingTimeConstant = 0.4;
    localVoiceSource.connect(localAnalyser);
  } catch (e) {
    console.warn('Error attaching local audio analyser:', e);
  }

  updateMicHudDisplay();
  return localVoiceStream;
}

function toggleMicMute() {
  isMicMuted = !isMicMuted;
  if (localVoiceStream) {
    localVoiceStream.getAudioTracks().forEach(track => {
      track.enabled = !isMicMuted;
    });
  }
  updateMicHudDisplay();
}

function updateMicHudDisplay() {
  if (isMicMuted) {
    micHudToggle.classList.add('muted');
    micHudIcon.textContent = '🔇';
    micHudLabel.textContent = 'MUTED [V]';
    micTouchBtn.classList.add('muted');
    micTouchBtn.textContent = '🔇';
  } else {
    micHudToggle.classList.remove('muted');
    micHudIcon.textContent = '🎙️';
    micHudLabel.textContent = 'MIC ON [V]';
    micTouchBtn.classList.remove('muted');
    micTouchBtn.textContent = '🎙️';
  }
}

micHudToggle.addEventListener('click', () => toggleMicMute());
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyV') toggleMicMute();
});

function setupRemoteVoice(remotePeerId, stream, call = null) {
  const ctx = getOrCreateAudioContext();
  cleanupRemoteVoice(remotePeerId);

  // iOS / Mobile WebKit fix: Elements MUST be in DOM and muted to prevent raw audio leaking
  const hiddenAudio = document.createElement('audio');
  hiddenAudio.style.display = 'none';
  hiddenAudio.setAttribute('playsinline', '');
  hiddenAudio.setAttribute('autoplay', '');
  hiddenAudio.muted = true;
  hiddenAudio.srcObject = stream;
  document.body.appendChild(hiddenAudio);

  hiddenAudio.play().catch(() => {
    const unlock = () => {
      hiddenAudio.play().catch(() => {});
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
    };
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
  });

  let source, panner, gain, analyser;
  try {
    source = ctx.createMediaStreamSource(stream);
    panner = ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = MIN_PROXIMITY_DIST;
    panner.maxDistance = MAX_PROXIMITY_DIST;
    panner.rolloffFactor = 1.2;
    panner.coneInnerAngle = 360;

    gain = ctx.createGain();
    gain.gain.value = 1.0;

    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.4;

    source.connect(analyser);
    source.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);
  } catch (e) {
    console.warn('Web Audio routing fallback for peer:', remotePeerId, e);
  }

  remoteVoices.set(remotePeerId, {
    stream, source, panner, gain, analyser, hiddenAudio, call,
    isSpeaking: false, volume: 0
  });

  updateSpeakerTabs();
}

function cleanupRemoteVoice(remotePeerId) {
  const v = remoteVoices.get(remotePeerId);
  if (v) {
    try {
      if (v.source) v.source.disconnect();
      if (v.panner) v.panner.disconnect();
      if (v.gain) v.gain.disconnect();
      if (v.analyser) v.analyser.disconnect();
      if (v.hiddenAudio) {
        v.hiddenAudio.pause();
        v.hiddenAudio.srcObject = null;
        v.hiddenAudio.remove();
      }
    } catch (e) {}
    remoteVoices.delete(remotePeerId);
  }
  pendingVoiceCalls.delete(remotePeerId);
  updateSpeakerTabs();
}

const freqBuffer = new Uint8Array(128);
const VOICE_THRESHOLD = 14;

function pollVoiceActivity() {
  if (localAnalyser && !isMicMuted) {
    localAnalyser.getByteFrequencyData(freqBuffer);
    let sum = 0;
    for (let i = 0; i < freqBuffer.length; i++) sum += freqBuffer[i];
    localIsSpeaking = (sum / freqBuffer.length) > VOICE_THRESHOLD;
  } else {
    localIsSpeaking = false;
  }

  remoteVoices.forEach((v, peerId) => {
    if (v.analyser) {
      v.analyser.getByteFrequencyData(freqBuffer);
      let sum = 0;
      for (let i = 0; i < freqBuffer.length; i++) sum += freqBuffer[i];
      const avg = sum / freqBuffer.length;
      v.volume = avg;
      v.isSpeaking = avg > VOICE_THRESHOLD;

      const mesh = remotePlayers.get(peerId);
      if (mesh && mesh.userData && mesh.userData.visor) {
        if (v.isSpeaking) {
          mesh.userData.visor.material.color.setHex(0x00ff88);
        } else {
          mesh.userData.visor.material.color.setHex(mesh.userData.team === 'RED' ? 0xff2244 : 0x00e5ff);
        }
      }
    }
  });

  updateSpeakerTabs();
}
setInterval(pollVoiceActivity, 80);

function updateSpeakerTabs() {
  voiceSpeakerTabsEl.innerHTML = '';

  const localTab = document.createElement('div');
  localTab.className = `voice-tab team-${myTeam.toLowerCase()}` + (localIsSpeaking ? ' speaking' : '') + (isMicMuted ? ' muted' : '');
  localTab.innerHTML = `
    <span class="voice-tab-icon">${isMicMuted ? '🔇' : '🎙️'}</span>
    <span><b>${myPlayerName}</b></span>
    <span class="voice-tab-dist">YOU</span>
    <div class="voice-wave"><span></span><span></span><span></span></div>
  `;
  voiceSpeakerTabsEl.appendChild(localTab);

  if (isSoloMode) {
    const b1 = document.createElement('div');
    b1.className = 'voice-tab team-blue muted';
    b1.innerHTML = `<span class="voice-tab-icon">🤖</span><span>BOT ALPHA</span><span class="voice-tab-dist">AI</span>`;
    const b2 = document.createElement('div');
    b2.className = 'voice-tab team-blue muted';
    b2.innerHTML = `<span class="voice-tab-icon">🤖</span><span>BOT BETA</span><span class="voice-tab-dist">AI</span>`;
    voiceSpeakerTabsEl.appendChild(b1);
    voiceSpeakerTabsEl.appendChild(b2);
    return;
  }

  if (!networkManager) return;

  for (const [peerId, info] of networkManager.lobbyRoster.entries()) {
    if (networkManager.peer && peerId === networkManager.peer.id) continue;

    const rVoice = remoteVoices.get(peerId);
    const rPlayerMesh = remotePlayers.get(peerId);
    const isSpeaking = rVoice ? rVoice.isSpeaking : false;

    let distLabel = 'LOBBY';
    if (isMatchActive && rPlayerMesh) {
      const dist = Math.round(camera.position.distanceTo(rPlayerMesh.position));
      distLabel = dist > MAX_PROXIMITY_DIST ? '>75m' : `${dist}m`;
    }

    const tab = document.createElement('div');
    tab.className = `voice-tab team-${(info.team || 'red').toLowerCase()}` + (isSpeaking ? ' speaking' : '');
    tab.innerHTML = `
      <span class="voice-tab-icon">${isSpeaking ? '🔊' : '🔈'}</span>
      <span>${info.name || 'OPERATIVE'}</span>
      <span class="voice-tab-dist">${distLabel}</span>
      <div class="voice-wave"><span></span><span></span><span></span></div>
    `;
    voiceSpeakerTabsEl.appendChild(tab);
  }
}

// ================= Remote Player Avatars =================
const remotePlayers = new Map();

function createPlayerMesh(name, team) {
  const root = new THREE.Group();
  const accent = team === 'RED' ? 0xff2244 : 0x00e5ff;

  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.4), new THREE.MeshStandardMaterial({ color: 0x3d4757, roughness: 0.4, metalness: 0.5 }));
  chest.position.y = 1.05;

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.42, 12), new THREE.MeshBasicMaterial({ color: accent }));
  core.rotation.x = Math.PI / 2; core.position.set(0, 1.1, 0.05);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), new THREE.MeshStandardMaterial({ color: 0x4f5869, metalness: 0.6, roughness: 0.25 }));
  head.position.y = 1.75;
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.2), new THREE.MeshBasicMaterial({ color: accent }));
  visor.position.set(0, 1.75, 0.22);

  const limbMat = new THREE.MeshStandardMaterial({ color: 0x2e3542, roughness: 0.6 });
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.25), limbMat); legL.position.set(-0.2, 0.35, 0);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.25), limbMat); legR.position.set(0.2, 0.35, 0);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.2), limbMat); armL.position.set(-0.45, 1.05, 0);
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.2), limbMat); armR.position.set(0.45, 1.05, 0);

  const shoulderL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.42), new THREE.MeshBasicMaterial({ color: accent })); shoulderL.position.set(-0.42, 1.42, 0);
  const shoulderR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.42), new THREE.MeshBasicMaterial({ color: accent })); shoulderR.position.set(0.42, 1.42, 0);

  const weaponMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.7), new THREE.MeshStandardMaterial({ color: 0x556074 }));
  weaponMesh.position.set(0.35, 1.0, 0.4);

  const nameCanvas = document.createElement('canvas');
  nameCanvas.width = 256; nameCanvas.height = 64;
  const nCtx = nameCanvas.getContext('2d');
  nCtx.fillStyle = 'rgba(10, 15, 30, 0.75)'; nCtx.fillRect(0, 0, 256, 64);
  nCtx.strokeStyle = team === 'RED' ? '#ff3355' : '#00e5ff'; nCtx.lineWidth = 4; nCtx.strokeRect(0, 0, 256, 64);
  nCtx.fillStyle = team === 'RED' ? '#ff3355' : '#00e5ff'; nCtx.font = 'bold 24px Courier New'; nCtx.textAlign = 'center';
  nCtx.fillText(`[${team}] ${name.substring(0, 10)}`, 128, 42);
  const nameTex = new THREE.CanvasTexture(nameCanvas);
  const nameTag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), new THREE.MeshBasicMaterial({ map: nameTex, side: THREE.DoubleSide, transparent: true }));
  nameTag.position.y = 2.35;

  root.add(chest, core, head, visor, legL, legR, armL, armR, shoulderL, shoulderR, weaponMesh, nameTag);
  root.userData = { name, team, nameTag, visor, targetPos: new THREE.Vector3(), targetRotY: 0, hp: 100 };
  return root;
}

// ================= Multiplayer WebRTC Network =================
class NetworkManager {
  constructor(roomCode, playerName) {
    this.roomCode = roomCode.toUpperCase().trim() || 'SECTOR-7';
    this.playerName = playerName.trim() || myPlayerName;
    this.hostPeerId = `cyberfps-host-${this.roomCode}`;
    this.peer = null;
    this.hostConn = null;
    this.clients = new Map();
    this.isHost = false;
    this.lastBroadcast = 0;
    this.lobbyRoster = new Map();
    this.connectAsClient();
  }

  setupVoiceListeners() {
    if (!this.peer) return;

    this.peer.on('call', (call) => {
      const streamToSend = localVoiceStream || createSilentFallbackStream();
      call.answer(streamToSend);
      call.on('stream', (remoteStream) => {
        setupRemoteVoice(call.peer, remoteStream, call);
      });
      call.on('close', () => cleanupRemoteVoice(call.peer));
      call.on('error', () => cleanupRemoteVoice(call.peer));
    });
  }

  syncVoiceMeshCalls() {
    if (!this.peer || this.peer.destroyed || !this.peer.open || !localVoiceStream) return;
    const myId = this.peer.id;

    for (const [peerId] of this.lobbyRoster.entries()) {
      if (peerId === myId) continue;
      if (myId < peerId && !remoteVoices.has(peerId) && !pendingVoiceCalls.has(peerId)) {
        pendingVoiceCalls.add(peerId);
        setTimeout(() => pendingVoiceCalls.delete(peerId), 5000);

        const call = this.peer.call(peerId, localVoiceStream);
        if (call) {
          call.on('stream', (remoteStream) => {
            pendingVoiceCalls.delete(peerId);
            setupRemoteVoice(peerId, remoteStream, call);
          });
          call.on('close', () => {
            pendingVoiceCalls.delete(peerId);
            cleanupRemoteVoice(peerId);
          });
          call.on('error', () => {
            pendingVoiceCalls.delete(peerId);
            cleanupRemoteVoice(peerId);
          });
        }
      }
    }
  }

  connectAsClient() {
    const myRandomId = `cyberfps-p-${this.roomCode}-${Math.floor(Math.random() * 1000000)}`;
    this.peer = new Peer(myRandomId, PEER_CONFIG);

    this.peer.on('open', () => {
      this.setupVoiceListeners();
      const conn = this.peer.connect(this.hostPeerId, { reliable: true });
      let hostFound = false;

      conn.on('open', () => {
        hostFound = true;
        this.hostConn = conn;
        this.isHost = false;
        lobbyRoleTitle.textContent = 'CONNECTED AS CLIENT';
        hostConfigRow.style.opacity = '0.5';
        hostConfigRow.style.pointerEvents = 'none';
        startMatchBtn.style.display = 'none';
        clientWaitMsg.style.display = 'block';

        this.sendToHost({ type: 'joinLobby', id: this.peer.id, name: this.playerName, team: myTeam });
        this.setupClientListeners(conn);
      });

      setTimeout(() => {
        if (!hostFound && !this.isHost) this.becomeHost();
      }, 1600);
    });

    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') this.connectAsClient();
    });
  }

  becomeHost() {
    if (this.peer) this.peer.destroy();
    this.peer = new Peer(this.hostPeerId, PEER_CONFIG);
    this.isHost = true;

    this.peer.on('open', () => {
      this.setupVoiceListeners();
      lobbyRoleTitle.textContent = 'HOST (CONFIGURING MISSION)';
      hostConfigRow.style.opacity = '1';
      hostConfigRow.style.pointerEvents = 'auto';
      startMatchBtn.style.display = 'inline-block';
      clientWaitMsg.style.display = 'none';
      this.lobbyRoster.set(this.peer.id, { name: this.playerName, team: myTeam });
      this.updateLobbyUI();
      this.syncVoiceMeshCalls();
    });

    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        this.clients.set(conn.peer, conn);
        this.broadcastLobbyState();
      });

      conn.on('data', (data) => {
        this.handleData(data, conn.peer);
        for (const [id, c] of this.clients.entries()) {
          if (id !== conn.peer && c.open) c.send(data);
        }
      });

      conn.on('close', () => {
        this.lobbyRoster.delete(conn.peer);
        this.removePlayer(conn.peer);
        this.clients.delete(conn.peer);
        cleanupRemoteVoice(conn.peer);
        this.broadcastLobbyState();
        this.updateLobbyUI();
      });
    });
  }

  setupClientListeners(conn) {
    conn.on('data', (data) => this.handleData(data, 'host'));
  }

  broadcast(packet) {
    const json = JSON.stringify(packet);
    if (this.isHost) {
      for (const c of this.clients.values()) if (c.open) c.send(json);
    } else if (this.hostConn && this.hostConn.open) {
      this.hostConn.send(json);
    }
  }

  sendToHost(packet) {
    if (this.hostConn && this.hostConn.open) {
      this.hostConn.send(JSON.stringify(packet));
    }
  }

  broadcastLobbyState() {
    if (!this.isHost) return;
    const rosterObj = {};
    for (const [k, v] of this.lobbyRoster.entries()) rosterObj[k] = v;
    this.broadcast({
      type: 'lobbySync',
      roster: rosterObj,
      matchDuration,
      gameMode,
      timeRemaining,
      redScore,
      blueScore,
      isMatchActive
    });
    this.updateLobbyUI();
    this.syncVoiceMeshCalls();
  }

  updateLobbyUI() {
    redTeamListEl.innerHTML = '';
    blueTeamListEl.innerHTML = '';
    for (const [id, p] of this.lobbyRoster.entries()) {
      const item = document.createElement('div');
      item.textContent = `• ${p.name}`;
      if (p.team === 'RED') redTeamListEl.appendChild(item);
      else blueTeamListEl.appendChild(item);
    }
    updateSpeakerTabs();
  }

  handleData(raw) {
    try {
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (data.type === 'joinLobby' || data.type === 'updateTeam') {
        this.lobbyRoster.set(data.id, { name: data.name, team: data.team });
        if (this.isHost) this.broadcastLobbyState();
        else this.updateLobbyUI();
        this.syncVoiceMeshCalls();
      } else if (data.type === 'lobbySync') {
        this.lobbyRoster.clear();
        for (const k in data.roster) this.lobbyRoster.set(k, data.roster[k]);
        matchDuration = data.matchDuration;
        timeRemaining = data.timeRemaining;
        gameMode = data.gameMode;
        redScore = data.redScore;
        blueScore = data.blueScore;
        hudModeNameEl.textContent = gameMode;
        timeSelect.value = matchDuration;
        modeSelect.value = gameMode;
        this.updateLobbyUI();
        updateScoreboard();
        this.syncVoiceMeshCalls();
      } else if (data.type === 'startMatch') {
        matchDuration = data.matchDuration;
        timeRemaining = matchDuration;
        gameMode = data.gameMode;
        hudModeNameEl.textContent = gameMode;
        startActiveGame();
      } else if (data.type === 'pos') {
        let p = remotePlayers.get(data.id);
        if (!p) {
          p = createPlayerMesh(data.name || 'AGENT', data.team || 'RED');
          scene.add(p);
          remotePlayers.set(data.id, p);
        }
        p.userData.targetPos.set(data.x, data.y, data.z);
        p.userData.targetRotY = data.rotY;
        p.userData.hp = data.hp;
        p.userData.team = data.team;
      } else if (data.type === 'shoot') {
        spawnRemoteTracer(new THREE.Vector3(data.ox, data.oy, data.oz), new THREE.Vector3(data.dx, data.dy, data.dz), data.team);
      } else if (data.type === 'damage') {
        if (this.peer && data.targetId === this.peer.id) {
          takeDamage(data.dmg, data.attackerName, data.attackerTeam, data.attackerId);
        }
      } else if (data.type === 'killSync') {
        killNotice(data.killer, data.victim);
        redScore = data.redScore;
        blueScore = data.blueScore;
        updateScoreboard();
      }
    } catch (e) {}
  }

  removePlayer(id) {
    const p = remotePlayers.get(id);
    if (p) {
      scene.remove(p);
      remotePlayers.delete(id);
    }
  }
}

let networkManager = null;

// Periodic mesh check to maintain WebRTC calls if packets dropped during transition
setInterval(() => {
  if (networkManager) {
    networkManager.syncVoiceMeshCalls();
  }
}, 4000);

// ================= Team Spawn Points =================
const RED_SPAWNS = [
  { x: -46, z: 0 },
  { x: -46, z: -6 },
  { x: -46, z: 6 },
  { x: -42, z: 2 }
];

const BLUE_SPAWNS = [
  { x: 46, z: 0 },
  { x: 46, z: -6 },
  { x: 46, z: 6 },
  { x: 42, z: -2 }
];

function spawnPlayerToTeamBase() {
  const pool = myTeam === 'RED' ? RED_SPAWNS : BLUE_SPAWNS;
  const sp = pool[Math.floor(Math.random() * pool.length)];
  const spawnY = heightAt(sp.x, sp.z) + NORMAL_EYE_HEIGHT;
  camera.position.set(sp.x, spawnY, sp.z);
  verticalVelocity = 0;
  currentEyeHeight = NORMAL_EYE_HEIGHT;
  isDashing = false;
  dashTimeRemaining = 0;
  if (myTeam === 'RED') camera.rotation.y = -Math.PI / 2;
  else camera.rotation.y = Math.PI / 2;
  camera.rotation.x = 0;
}

// Entry Modal Actions
enterLobbyBtn.addEventListener('click', async () => {
  getOrCreateAudioContext();
  await initProximityMic();
  myPlayerName = document.getElementById('playerNameInput').value.trim() || myPlayerName;
  currentRoomCode = document.getElementById('roomCodeInput').value.trim() || 'SECTOR-7';
  entryModal.style.display = 'none';
  lobbyModal.style.display = 'flex';
  lobbyRoomTitle.textContent = currentRoomCode;
  networkManager = new NetworkManager(currentRoomCode, myPlayerName);
});

soloLobbyBtn.addEventListener('click', async () => {
  getOrCreateAudioContext();
  await initProximityMic();
  isSoloMode = true;
  myPlayerName = document.getElementById('playerNameInput').value.trim() || myPlayerName;
  currentRoomCode = 'SOLO';
  entryModal.style.display = 'none';
  lobbyModal.style.display = 'flex';
  lobbyRoomTitle.textContent = 'SOLO (OFFLINE)';
  lobbyRoleTitle.textContent = 'HOST (SINGLE PLAYER)';
  redTeamListEl.innerHTML = `<div>• ${myPlayerName} (YOU)</div>`;
  blueTeamListEl.innerHTML = `<div>• CYBER-BOT ALPHA</div><div>• CYBER-BOT BETA</div>`;
  updateSpeakerTabs();
});

// Team Switching
joinRedBtn.addEventListener('click', () => {
  if (isMatchActive) return;
  myTeam = 'RED';
  hudMyTeamEl.textContent = 'RED';
  hudMyTeamEl.style.color = '#ff3355';
  if (networkManager) {
    networkManager.lobbyRoster.set(networkManager.peer ? networkManager.peer.id : 'local', { name: myPlayerName, team: myTeam });
    networkManager.broadcast({ type: 'updateTeam', id: networkManager.peer ? networkManager.peer.id : 'local', name: myPlayerName, team: myTeam });
    networkManager.updateLobbyUI();
  }
});

joinBlueBtn.addEventListener('click', () => {
  if (isMatchActive) return;
  myTeam = 'BLUE';
  hudMyTeamEl.textContent = 'BLUE';
  hudMyTeamEl.style.color = '#00e5ff';
  if (networkManager) {
    networkManager.lobbyRoster.set(networkManager.peer ? networkManager.peer.id : 'local', { name: myPlayerName, team: myTeam });
    networkManager.broadcast({ type: 'updateTeam', id: networkManager.peer ? networkManager.peer.id : 'local', name: myPlayerName, team: myTeam });
    networkManager.updateLobbyUI();
  }
});

timeSelect.addEventListener('change', () => {
  matchDuration = parseInt(timeSelect.value);
  timeRemaining = matchDuration;
  if (networkManager && networkManager.isHost) networkManager.broadcastLobbyState();
});

modeSelect.addEventListener('change', () => {
  gameMode = modeSelect.value;
  hudModeNameEl.textContent = gameMode;
  if (networkManager && networkManager.isHost) networkManager.broadcastLobbyState();
});

startMatchBtn.addEventListener('click', () => {
  getOrCreateAudioContext();
  matchDuration = parseInt(timeSelect.value);
  timeRemaining = matchDuration;
  gameMode = modeSelect.value;
  hudModeNameEl.textContent = gameMode;
  redScore = 0; blueScore = 0;
  personalKills = 0; personalDeaths = 0;

  if (networkManager && networkManager.isHost) {
    networkManager.broadcast({ type: 'startMatch', matchDuration, gameMode });
  }
  startActiveGame();
});

function startActiveGame() {
  getOrCreateAudioContext();
  lobbyModal.style.display = 'none';
  respawnModal.style.display = 'none';
  endGameModal.style.display = 'none';
  isMatchActive = true;
  health = MAX_HEALTH;
  healthBarEl.style.width = '100%';

  applySelectedLoadout();
  spawnPlayerToTeamBase();
  updateScoreboard();

  if (!isTouchDevice) controls.lock();
}

returnLobbyBtn.addEventListener('click', () => {
  endGameModal.style.display = 'none';
  lobbyModal.style.display = 'flex';
  isMatchActive = false;
  timeRemaining = matchDuration;
  updateScoreboard();
});

// ================= Damage, Health & Death Handling =================
let health = 100;
const MAX_HEALTH = 100;
let lastDamageTime = -999;
const REGEN_DELAY = 4.5;
const REGEN_RATE = 10;

function takeDamage(amount, attackerName = null, attackerTeam = null, attackerId = null) {
  if (!isMatchActive || health <= 0) return;
  if (attackerTeam && attackerTeam === myTeam) return;

  health = Math.max(0, health - amount);
  lastDamageTime = clockElapsed;
  healthBarEl.style.width = (health / MAX_HEALTH * 100) + '%';
  healthBarEl.style.background = health > 50 ? '#00ff88' : (health > 20 ? '#ffaa00' : '#ff2244');

  if (health <= 0) {
    personalDeaths++;
    if (attackerTeam === 'RED') redScore++;
    else if (attackerTeam === 'BLUE') blueScore++;

    killNotice(attackerName || 'SYSTEM', myPlayerName);
    updateScoreboard();

    if (networkManager) {
      networkManager.broadcast({
        type: 'killSync',
        killer: attackerName || 'SYSTEM',
        victim: myPlayerName,
        redScore,
        blueScore
      });
    }
    triggerRespawnSequence();
  }
}

function killNotice(killer, victim) {
  const item = document.createElement('div');
  item.className = 'kill-item';
  item.innerHTML = `<span style="color:#ff3355">${killer}</span> 💥 <span style="color:#00e5ff">${victim}</span>`;
  killfeedEl.appendChild(item);
  setTimeout(() => item.remove(), 4000);
}

let respawnCountdown = 3;
let respawnInterval = null;

function triggerRespawnSequence() {
  if (controls.isLocked) controls.unlock();
  respawnModal.style.display = 'flex';
  respawnCountdown = 3;
  document.getElementById('respawnTimerNum').textContent = respawnCountdown;

  clearInterval(respawnInterval);
  respawnInterval = setInterval(() => {
    respawnCountdown--;
    document.getElementById('respawnTimerNum').textContent = respawnCountdown;
    if (respawnCountdown <= 0) {
      clearInterval(respawnInterval);
      respawnModal.style.display = 'none';
      health = MAX_HEALTH;
      healthBarEl.style.width = '100%';
      healthBarEl.style.background = '#00ff88';
      applySelectedLoadout();
      spawnPlayerToTeamBase();
      if (!isTouchDevice && isMatchActive) controls.lock();
    }
  }, 1000);
}

function finishMatch() {
  isMatchActive = false;
  if (controls.isLocked) controls.unlock();

  endGameModal.style.display = 'flex';
  document.getElementById('endRedScore').textContent = redScore;
  document.getElementById('endBlueScore').textContent = blueScore;
  document.getElementById('endKills').textContent = personalKills;
  document.getElementById('endDeaths').textContent = personalDeaths;
  document.getElementById('endKD').textContent = (personalKills / Math.max(1, personalDeaths)).toFixed(2);

  const title = document.getElementById('endGameTitle');
  const sub = document.getElementById('endGameSub');

  if (redScore === blueScore) {
    title.textContent = 'STALEMATE // DRAW';
    title.style.color = '#ffdd44';
    sub.textContent = 'NEITHER SQUAD SECURED SECTOR DOMINANCE';
  } else if ((myTeam === 'RED' && redScore > blueScore) || (myTeam === 'BLUE' && blueScore > redScore)) {
    title.textContent = 'VICTORY';
    title.style.color = '#00ff88';
    sub.textContent = `${myTeam} TEAM SECURED FULL SECTOR DOMINANCE`;
  } else {
    title.textContent = 'DEFEAT';
    title.style.color = '#ff3355';
    sub.textContent = `HOSTILE FORCES SEIZED CONTROL OF SECTOR 07`;
  }
}

// ================= Movement, Input & Multi-Touch System =================
const controls = new PointerLockControls(camera, document.body);
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (isTouchDevice) document.body.classList.add('touch-device');

const move = { forward: false, back: false, left: false, right: false };
const velocity = new THREE.Vector3();
const BASE_SPEED = 8.5;
const DASH_SPEED_MULTIPLIER = 1.85;
let verticalVelocity = 0;
let isGrounded = true;
const GRAVITY = -22;
const JUMP_SPEED = 9.2;

function tryJump() {
  if (isGrounded) {
    verticalVelocity = JUMP_SPEED;
    isGrounded = false;
  }
}

document.addEventListener('keydown', (e) => {
  if (!isMatchActive) return;
  switch (e.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.back = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'ShiftLeft':
    case 'ShiftRight':
      triggerSlideDash();
      break;
    case 'KeyR': startReload(); break;
    case 'Space': tryJump(); break;
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

// ================= Robust Multi-Touch Engine =================
const joystickZone = document.getElementById('joystickZone');
const joystickKnob = document.getElementById('joystickKnob');
const fireBtn = document.getElementById('fireBtn');
const adsBtn = document.getElementById('adsBtn');
const slideBtn = document.getElementById('slideBtn');
const reloadBtn = document.getElementById('reloadBtn');
const jumpBtn = document.getElementById('jumpBtn');

let joystickTouchId = null;
let joystickVector = { x: 0, y: 0 };
let joystickCenter = { x: 0, y: 0 };
const JOYSTICK_MAX_RADIUS = 42;

const activeTouchMap = new Map();
let isFireButtonHeld = false;
const LOOK_SENSITIVITY = 0.0062;

function updateJoystickFromPos(clientX, clientY) {
  const dx = clientX - joystickCenter.x;
  const dy = clientY - joystickCenter.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const clampedDist = Math.min(dist, JOYSTICK_MAX_RADIUS);
  const knobX = Math.cos(angle) * clampedDist;
  const knobY = Math.sin(angle) * clampedDist;
  joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
  joystickVector.x = knobX / JOYSTICK_MAX_RADIUS;
  joystickVector.y = -knobY / JOYSTICK_MAX_RADIUS;
}

window.addEventListener('touchstart', (e) => {
  if (!isMatchActive) return;

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    const target = document.elementFromPoint(t.clientX, t.clientY);

    if (joystickZone.contains(target)) {
      if (joystickTouchId === null) {
        joystickTouchId = t.identifier;
        const rect = joystickZone.getBoundingClientRect();
        joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        updateJoystickFromPos(t.clientX, t.clientY);
        activeTouchMap.set(t.identifier, { type: 'joystick' });
      }
      continue;
    }

    if (target === fireBtn) {
      isFireButtonHeld = true;
      fireBtn.classList.add('active');
      tryShoot();
      activeTouchMap.set(t.identifier, { type: 'fire_look', lastX: t.clientX, lastY: t.clientY });
      continue;
    }

    if (target === adsBtn) {
      setAimState(!isAiming);
      adsBtn.classList.toggle('active', isAiming);
      activeTouchMap.set(t.identifier, { type: 'btn' });
      continue;
    }

    if (target === slideBtn) {
      triggerSlideDash();
      activeTouchMap.set(t.identifier, { type: 'btn' });
      continue;
    }

    if (target === jumpBtn) {
      tryJump();
      activeTouchMap.set(t.identifier, { type: 'btn' });
      continue;
    }

    if (target === reloadBtn) {
      startReload();
      activeTouchMap.set(t.identifier, { type: 'btn' });
      continue;
    }

    if (target === micTouchBtn) {
      toggleMicMute();
      activeTouchMap.set(t.identifier, { type: 'btn' });
      continue;
    }

    if (t.clientX > window.innerWidth * 0.32) {
      activeTouchMap.set(t.identifier, { type: 'look', lastX: t.clientX, lastY: t.clientY });
    }
  }
}, { passive: false });

window.addEventListener('touchmove', (e) => {
  if (!isMatchActive) return;

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];

    if (t.identifier === joystickTouchId) {
      updateJoystickFromPos(t.clientX, t.clientY);
      continue;
    }

    const touchData = activeTouchMap.get(t.identifier);
    if (touchData && (touchData.type === 'look' || touchData.type === 'fire_look')) {
      const dx = t.clientX - touchData.lastX;
      const dy = t.clientY - touchData.lastY;
      touchData.lastX = t.clientX;
      touchData.lastY = t.clientY;

      const sens = isAiming ? LOOK_SENSITIVITY * 0.5 : LOOK_SENSITIVITY;
      camera.rotation.y -= dx * sens;
      camera.rotation.x -= dy * sens;
      camera.rotation.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, camera.rotation.x));
    }
  }
}, { passive: false });

const handleTouchEnd = (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];

    if (t.identifier === joystickTouchId) {
      joystickTouchId = null;
      joystickVector = { x: 0, y: 0 };
      joystickKnob.style.transform = `translate(0px, 0px)`;
    }

    const touchData = activeTouchMap.get(t.identifier);
    if (touchData && touchData.type === 'fire_look') {
      isFireButtonHeld = false;
      fireBtn.classList.remove('active');
    }

    activeTouchMap.delete(t.identifier);
  }
};

window.addEventListener('touchend', handleTouchEnd, { passive: false });
window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

// ================= Bullets, Hitmarkers & PvP Combat =================
const bulletGeo = new THREE.SphereGeometry(0.09, 6, 6);
const bulletMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const bullets = [];

let recoilPitch = 0;
let recoilYaw = 0;
const RECOIL_RECOVERY_SPEED = 5.5;

function applyRecoilKick(weapon) {
  const aimFactor = isAiming ? 0.65 : 1.0;
  const kickUp = (weapon.recoilKick || 0.01) * aimFactor;
  const kickSide = (Math.random() - 0.5) * 2 * (weapon.recoilSide || 0.008) * aimFactor;
  camera.rotation.x += kickUp;
  camera.rotation.y += kickSide;
  camera.rotation.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, camera.rotation.x));
  recoilPitch += kickUp;
  recoilYaw += kickSide;
}

const hitmarker = document.getElementById('hitmarker');
let hitmarkerTimeout = null;
function showHitmarker() {
  hitmarker.style.opacity = '1';
  clearTimeout(hitmarkerTimeout);
  hitmarkerTimeout = setTimeout(() => { hitmarker.style.opacity = '0'; }, 80);
}

function spawnRemoteTracer(origin, dir, team) {
  const tracer = new THREE.Mesh(bulletGeo, new THREE.MeshBasicMaterial({ color: team === 'RED' ? 0xff2244 : 0x00e5ff }));
  tracer.position.copy(origin);
  tracer.userData.velocity = dir.clone().multiplyScalar(75);
  tracer.userData.life = 1.2;
  scene.add(tracer);
  bullets.push(tracer);
}

function fireOnePellet(weapon) {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const currentSpread = isAiming ? weapon.spread * 0.4 : weapon.spread;
  dir.x += (Math.random() - 0.5) * currentSpread;
  dir.y += (Math.random() - 0.5) * currentSpread;
  dir.z += (Math.random() - 0.5) * currentSpread;
  dir.normalize();

  const bullet = new THREE.Mesh(bulletGeo, bulletMat);
  bullet.position.copy(camera.position);
  bullet.userData.velocity = dir.clone().multiplyScalar(weapon.bulletSpeed);
  bullet.userData.life = weapon.life;
  bullet.userData.damage = weapon.damage;
  bullet.userData.isLocal = true;
  scene.add(bullet);
  bullets.push(bullet);

  if (networkManager) {
    networkManager.broadcast({
      type: 'shoot',
      ox: camera.position.x, oy: camera.position.y, oz: camera.position.z,
      dx: dir.x, dy: dir.y, dz: dir.z,
      team: myTeam
    });
  }
}

function tryShoot() {
  if (!isMatchActive || health <= 0) return;
  if (reloading || fireTimer > 0) return;

  const weapon = currentWeapon();
  const state = ammoState[currentWeaponIndex];

  if (gameMode !== 'NOAMMO') {
    if (state.mag <= 0) { startReload(); return; }
    state.mag -= 1;
  }

  for (let p = 0; p < weapon.pellets; p++) fireOnePellet(weapon);
  applyRecoilKick(weapon);

  gunGroup.position.z = -0.55;
  setTimeout(() => { gunGroup.position.z = isAiming ? ADS_GUN_POS.z : NORMAL_GUN_POS.z; }, 50);

  fireTimer = weapon.fireDelay;
  updateWeaponHud();
}

let isMouseDown = false;
document.addEventListener('mousedown', (e) => { 
  if (!isMatchActive) return;
  if (e.button === 0) { isMouseDown = true; tryShoot(); } 
  else if (e.button === 2) setAimState(true);
});

document.addEventListener('mouseup', (e) => { 
  if (e.button === 0) isMouseDown = false; 
  else if (e.button === 2) setAimState(false);
});

function startReload() {
  if (gameMode === 'NOAMMO') return;
  const state = ammoState[currentWeaponIndex];
  const weapon = currentWeapon();
  if (reloading || state.mag >= weapon.mag || state.reserve <= 0) return;
  if (isAiming) setAimState(false);
  reloading = true;
  reloadTimer = weapon.reload;
  reloadMsgEl.style.opacity = '1';
}

function finishReload() {
  const state = ammoState[currentWeaponIndex];
  const weapon = currentWeapon();
  const taken = Math.min(weapon.mag - state.mag, state.reserve);
  state.mag += taken;
  state.reserve -= taken;
  reloading = false;
  reloadMsgEl.style.opacity = '0';
  updateWeaponHud();
}

// ================= Main Loop =================
const clock = new THREE.Clock();
let clockElapsed = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  clockElapsed += delta;

  // Match Timer
  if (isMatchActive) {
    timeRemaining -= delta;
    updateScoreboard();

    if (timeRemaining <= 0) {
      timeRemaining = 0;
      finishMatch();
    }
  }

  // Dash & Slide Timers & Camera Height Lerp
  if (isDashing) {
    dashTimeRemaining -= delta;
    currentEyeHeight = THREE.MathUtils.lerp(currentEyeHeight, DASH_EYE_HEIGHT, delta * 12);
    if (dashTimeRemaining <= 0) {
      isDashing = false;
      dashCooldownTimer = DASH_COOLDOWN;
    }
  } else {
    currentEyeHeight = THREE.MathUtils.lerp(currentEyeHeight, NORMAL_EYE_HEIGHT, delta * 10);
    if (dashCooldownTimer > 0) {
      dashCooldownTimer -= delta;
    }
  }

  // Dash Bar HUD
  if (isDashing) {
    dashBarEl.style.width = ((dashTimeRemaining / DASH_DURATION) * 100) + '%';
    dashBarEl.style.background = '#00ff88';
    slideBtn.classList.add('active');
  } else if (dashCooldownTimer > 0) {
    dashBarEl.style.width = (((DASH_COOLDOWN - dashCooldownTimer) / DASH_COOLDOWN) * 100) + '%';
    dashBarEl.style.background = '#ffaa00';
    slideBtn.classList.remove('active');
  } else {
    dashBarEl.style.width = '100%';
    dashBarEl.style.background = '#00e5ff';
    slideBtn.classList.remove('active');
  }

  // Dynamic FOV for Dash & Aiming
  let targetFov = isAiming ? currentWeapon().fov : DEFAULT_FOV;
  if (isDashing) targetFov += 10;
  camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 14);
  camera.updateProjectionMatrix();

  const targetGunPos = isAiming ? ADS_GUN_POS : NORMAL_GUN_POS;
  gunGroup.position.lerp(targetGunPos, delta * 15);

  // Hologram Plaza Animation
  if (holoGemMesh) {
    holoGemMesh.rotation.x += delta * 0.8;
    holoGemMesh.rotation.y += delta * 1.2;
  }

  // Update Remote Players
  remotePlayers.forEach((mesh) => {
    mesh.position.lerp(mesh.userData.targetPos, 0.2);
    mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, mesh.userData.targetRotY, 0.2);
    mesh.userData.nameTag.lookAt(camera.position);
  });

  // Spatial Audio Listener & Proximity Updates
  if (voiceAudioCtx && voiceAudioCtx.state === 'running') {
    const p = camera.position;
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    const up = camera.up;

    if (voiceAudioCtx.listener.positionX) {
      voiceAudioCtx.listener.positionX.setTargetAtTime(p.x, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.positionY.setTargetAtTime(p.y, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.positionZ.setTargetAtTime(p.z, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.forwardX.setTargetAtTime(fwd.x, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.forwardY.setTargetAtTime(fwd.y, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.forwardZ.setTargetAtTime(fwd.z, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.upX.setTargetAtTime(up.x, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.upY.setTargetAtTime(up.y, voiceAudioCtx.currentTime, 0.05);
      voiceAudioCtx.listener.upZ.setTargetAtTime(up.z, voiceAudioCtx.currentTime, 0.05);
    } else if (voiceAudioCtx.listener.setPosition) {
      voiceAudioCtx.listener.setPosition(p.x, p.y, p.z);
      voiceAudioCtx.listener.setOrientation(fwd.x, fwd.y, fwd.z, up.x, up.y, up.z);
    }

    remoteVoices.forEach((voice, peerId) => {
      const playerMesh = remotePlayers.get(peerId);
      if (!isMatchActive || !playerMesh) {
        if (voice.gain) voice.gain.gain.value = 1.0;
        return;
      }

      const targetPos = playerMesh.position;
      const dist = camera.position.distanceTo(targetPos);

      if (voice.gain) {
        voice.gain.gain.value = dist > MAX_PROXIMITY_DIST ? 0 : 1.0;
      }

      if (voice.panner) {
        if (voice.panner.positionX) {
          voice.panner.positionX.setTargetAtTime(targetPos.x, voiceAudioCtx.currentTime, 0.05);
          voice.panner.positionY.setTargetAtTime(targetPos.y + 1.6, voiceAudioCtx.currentTime, 0.05);
          voice.panner.positionZ.setTargetAtTime(targetPos.z, voiceAudioCtx.currentTime, 0.05);
        } else if (voice.panner.setPosition) {
          voice.panner.setPosition(targetPos.x, targetPos.y + 1.6, targetPos.z);
        }
      }
    });
  }

  if (fireTimer > 0) fireTimer -= delta;
  if (isMouseDown || isFireButtonHeld) tryShoot();

  // Recoil recovery
  if (recoilPitch !== 0 || recoilYaw !== 0) {
    const recoverAmt = Math.min(1, RECOIL_RECOVERY_SPEED * delta);
    const pitchStep = recoilPitch * recoverAmt;
    const yawStep = recoilYaw * recoverAmt;
    camera.rotation.x -= pitchStep;
    camera.rotation.y -= yawStep;
    camera.rotation.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, camera.rotation.x));
    recoilPitch -= pitchStep;
    recoilYaw -= yawStep;
  }

  if (reloading) {
    reloadTimer -= delta;
    if (reloadTimer <= 0) finishReload();
  }

  // Health Regen
  if (health > 0 && health < MAX_HEALTH && (clockElapsed - lastDamageTime) > REGEN_DELAY) {
    health = Math.min(MAX_HEALTH, health + REGEN_RATE * delta);
    healthBarEl.style.width = (health / MAX_HEALTH * 100) + '%';
    healthBarEl.style.background = health > 50 ? '#00ff88' : (health > 20 ? '#ffaa00' : '#ff2244');
  }

  // Movement & Collisions
  if (isMatchActive && (controls.isLocked || isTouchDevice)) {
    let speed = (gameMode === 'SPEED' ? BASE_SPEED * 2 : BASE_SPEED) * (isAiming ? 0.6 : 1.0);
    if (isDashing) speed *= DASH_SPEED_MULTIPLIER;

    velocity.set(0, 0, 0);

    if (isDashing) {
      velocity.copy(dashDir).multiplyScalar(speed * delta);
    } else {
      const forwardInput = ((move.forward ? 1 : 0) - (move.back ? 1 : 0)) + joystickVector.y;
      const rightInput = ((move.right ? 1 : 0) - (move.left ? 1 : 0)) + joystickVector.x;

      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0; forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

      velocity.addScaledVector(forward, forwardInput);
      velocity.addScaledVector(right, rightInput);
      if (velocity.lengthSq() > 0) {
        if (velocity.length() > 1) velocity.normalize();
        velocity.multiplyScalar(speed * delta);
      }
    }

    const nextPos = camera.position.clone().add(velocity);
    const feet = camera.position.y - currentEyeHeight;
    const headTop = feet + currentEyeHeight + 0.1;

    let blocked = false;
    for (const p of colliders) {
      if (nextPos.x >= p.minX && nextPos.x <= p.maxX && nextPos.z >= p.minZ && nextPos.z <= p.maxZ) {
        if (!(feet >= p.top - 0.35) && !(headTop <= p.bottom + 0.05)) { blocked = true; break; }
      }
    }
    if (!blocked) camera.position.copy(nextPos);

    camera.position.x = Math.max(-HALF_W + 1.5, Math.min(HALF_W - 1.5, camera.position.x));
    camera.position.z = Math.max(-HALF_D + 1.5, Math.min(HALF_D - 1.5, camera.position.z));

    let surface = heightAt(camera.position.x, camera.position.z);
    for (const p of colliders) {
      if (camera.position.x >= p.minX && camera.position.x <= p.maxX && camera.position.z >= p.minZ && camera.position.z <= p.maxZ) {
        if (feet >= p.top - 0.35) surface = Math.max(surface, p.top);
      }
    }
    const groundY = surface + currentEyeHeight;

    verticalVelocity += GRAVITY * delta;
    camera.position.y += verticalVelocity * delta;
    if (camera.position.y <= groundY) {
      camera.position.y = groundY;
      verticalVelocity = 0;
      isGrounded = true;
    } else {
      isGrounded = false;
    }

    if (networkManager && (clockElapsed - networkManager.lastBroadcast > 0.05)) {
      networkManager.broadcast({
        type: 'pos',
        id: networkManager.peer ? networkManager.peer.id : 'local',
        name: myPlayerName,
        team: myTeam,
        x: camera.position.x,
        y: camera.position.y - currentEyeHeight,
        z: camera.position.z,
        rotY: camera.rotation.y,
        hp: health
      });
      networkManager.lastBroadcast = clockElapsed;
    }
  }

  // Bullets Simulation & PvP Hit Checks
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.position.addScaledVector(b.userData.velocity, delta);
    b.userData.life -= delta;

    let hit = false;
    if (b.userData.isLocal) {
      for (const [peerId, rPlayer] of remotePlayers.entries()) {
        if (rPlayer.userData.team === myTeam) continue;

        const playerCenter = rPlayer.position.clone().add(new THREE.Vector3(0, 1.0, 0));
        if (b.position.distanceTo(playerCenter) < 1.1) {
          showHitmarker();
          personalKills++;
          updateScoreboard();

          if (networkManager) {
            networkManager.broadcast({
              type: 'damage',
              targetId: peerId,
              attackerName: myPlayerName,
              attackerTeam: myTeam,
              attackerId: networkManager.peer ? networkManager.peer.id : 'local',
              dmg: b.userData.damage
            });
          }
          hit = true;
          break;
        }
      }
    }

    if (hit || b.userData.life <= 0) {
      scene.remove(b);
      bullets.splice(i, 1);
    }
  }

  renderer.render(scene, camera);
}

updateScoreboard();
updateWeaponHud();
updateMicHudDisplay();
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
