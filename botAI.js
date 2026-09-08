import * as THREE from 'three';
import { playGunshot } from './audio.js';

export class BotManager {
  constructor(scene, particles, onBotDamage) {
    this.scene = scene;
    this.particles = particles;
    this.onBotDamage = onBotDamage;
    this.bots = [];
    this.waypoints = [
      new THREE.Vector3(-30, 0, 0),
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(30, 0, 0),
      new THREE.Vector3(-18, 0, 18),
      new THREE.Vector3(18, 0, -18),
      new THREE.Vector3(-10, 0, -10),
      new THREE.Vector3(10, 0, 10)
    ];
  }

  spawnBot(name, team, spawnPos) {
    const root = new THREE.Group();
    const accent = team === 'RED' ? 0xff2244 : 0x00e5ff;

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.4), new THREE.MeshStandardMaterial({ color: 0x3d4757 }));
    chest.position.y = 1.05;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.42, 12), new THREE.MeshBasicMaterial({ color: accent }));
    core.rotation.x = Math.PI / 2; core.position.set(0, 1.1, 0.05);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), new THREE.MeshStandardMaterial({ color: 0x4f5869 }));
    head.position.y = 1.75;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.2), new THREE.MeshBasicMaterial({ color: accent }));
    visor.position.set(0, 1.75, 0.22);

    const limbMat = new THREE.MeshStandardMaterial({ color: 0x2e3542 });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.25), limbMat); legL.position.set(-0.2, 0.35, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.25), limbMat); legR.position.set(0.2, 0.35, 0);
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.7), new THREE.MeshStandardMaterial({ color: 0x556074 }));
    gun.position.set(0.35, 1.0, 0.4);

    const nameCanvas = document.createElement('canvas');
    nameCanvas.width = 256; nameCanvas.height = 64;
    const nCtx = nameCanvas.getContext('2d');
    nCtx.fillStyle = 'rgba(10, 15, 30, 0.75)'; nCtx.fillRect(0, 0, 256, 64);
    nCtx.strokeStyle = accent === 0xff2244 ? '#ff3355' : '#00e5ff'; nCtx.lineWidth = 4; nCtx.strokeRect(0, 0, 256, 64);
    nCtx.fillStyle = accent === 0xff2244 ? '#ff3355' : '#00e5ff'; nCtx.font = 'bold 24px Courier New'; nCtx.textAlign = 'center';
    nCtx.fillText(`[BOT] ${name}`, 128, 42);
    const nameTex = new THREE.CanvasTexture(nameCanvas);
    const nameTag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), new THREE.MeshBasicMaterial({ map: nameTex, side: THREE.DoubleSide, transparent: true }));
    nameTag.position.y = 2.35;

    root.add(chest, core, head, visor, legL, legR, gun, nameTag);
    root.position.copy(spawnPos);
    this.scene.add(root);

    const bot = {
      id: 'bot-' + Math.random().toString(36).substr(2, 6),
      name, team, mesh: root, nameTag,
      hp: 100, maxHp: 100,
      currentWpIndex: Math.floor(Math.random() * this.waypoints.length),
      shootCooldown: Math.random() * 1.5,
      slideCooldown: Math.random() * 4.0,
      isSliding: false, slideTimer: 0,
      speed: 6.8, isDead: false, respawnTimer: 0,
      spawnPos: spawnPos.clone()
    };
    this.bots.push(bot);
    return bot;
  }

  damageBot(bot, dmg, attackerName, attackerTeam) {
    if (bot.isDead || bot.team === attackerTeam) return;
    bot.hp -= dmg;
    this.particles.spawnPlasmaBurst(bot.mesh.position.clone().add(new THREE.Vector3(0, 1.2, 0)), bot.team, 8);

    if (bot.hp <= 0) {
      bot.isDead = true;
      bot.mesh.visible = false;
      bot.respawnTimer = 3.5;
      this.onBotDamage(bot, dmg, true, attackerName, attackerTeam);
    } else {
      this.onBotDamage(bot, dmg, false, attackerName, attackerTeam);
    }
  }

  update(delta, playerPos, playerTeam, heightAtFunc) {
    for (const bot of this.bots) {
      if (bot.isDead) {
        bot.respawnTimer -= delta;
        if (bot.respawnTimer <= 0) {
          bot.isDead = false;
          bot.hp = bot.maxHp;
          bot.mesh.position.copy(bot.spawnPos);
          bot.mesh.visible = true;
        }
        continue;
      }

      bot.nameTag.lookAt(playerPos);

      // Distance to player
      const distToPlayer = bot.mesh.position.distanceTo(playerPos);
      const hasLOS = distToPlayer < 40 && playerTeam !== bot.team;

      let targetPos = this.waypoints[bot.currentWpIndex];
      if (hasLOS) {
        targetPos = playerPos;
        bot.mesh.lookAt(playerPos.x, bot.mesh.position.y, playerPos.z);

        // Shoot at player
        bot.shootCooldown -= delta;
        if (bot.shootCooldown <= 0) {
          bot.shootCooldown = 0.4 + Math.random() * 0.5;
          playGunshot('AR', false);
          // Accuracy check
          if (Math.random() < 0.35 && distToPlayer < 30) {
            window.dispatchEvent(new CustomEvent('player-damaged-by-bot', {
              detail: { dmg: 14, botName: bot.name, botTeam: bot.team }
            }));
          }
        }
      } else {
        const wpDist = bot.mesh.position.distanceTo(targetPos);
        if (wpDist < 3.0) {
          bot.currentWpIndex = (bot.currentWpIndex + 1) % this.waypoints.length;
        }
        bot.mesh.lookAt(targetPos.x, bot.mesh.position.y, targetPos.z);
      }

      // Move bot forward
      const moveDir = new THREE.Vector3();
      bot.mesh.getWorldDirection(moveDir);
      let curSpeed = bot.speed;
      if (bot.isSliding) curSpeed *= 1.8;

      bot.mesh.position.addScaledVector(moveDir, curSpeed * delta);
      bot.mesh.position.y = heightAtFunc(bot.mesh.position.x, bot.mesh.position.z);
    }
  }
}
