import * as THREE from 'three';

export class ParticleEngine {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.muzzleFlashes = [];

    // Reusable geometry & materials
    this.sparkGeo = new THREE.BufferGeometry();
    this.sparkGeo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0], 3));
    this.sparkMat = new THREE.PointsMaterial({ color: 0xffcc00, size: 0.25, transparent: true, opacity: 0.9 });
    this.plasmaMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.35, transparent: true, opacity: 1.0 });

    this.screenTrauma = 0;
  }

  addScreenShake(amount = 0.02) {
    this.screenTrauma = Math.min(0.08, this.screenTrauma + amount);
  }

  getScreenShakeOffset() {
    if (this.screenTrauma <= 0.0001) return { x: 0, y: 0 };
    const shakeX = (Math.random() - 0.5) * 2 * this.screenTrauma;
    const shakeY = (Math.random() - 0.5) * 2 * this.screenTrauma;
    return { x: shakeX, y: shakeY };
  }

  spawnSparks(pos, normal, count = 10, colorHex = 0xffcc00) {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Points(this.sparkGeo, new THREE.PointsMaterial({ color: colorHex, size: 0.2, transparent: true, opacity: 1.0 }));
      mesh.position.copy(pos);
      const vel = new THREE.Vector3(
        normal.x + (Math.random() - 0.5) * 1.5,
        normal.y + (Math.random() - 0.5) * 1.5,
        normal.z + (Math.random() - 0.5) * 1.5
      ).normalize().multiplyScalar(Math.random() * 8 + 4);

      this.scene.add(mesh);
      this.particles.push({ mesh, vel, life: 0.25, maxLife: 0.25, gravity: -18 });
    }
  }

  spawnPlasmaBurst(pos, team = 'RED', count = 14) {
    const color = team === 'RED' ? 0xff2244 : 0x00e5ff;
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Points(this.sparkGeo, new THREE.PointsMaterial({ color, size: 0.35, transparent: true, opacity: 1.0 }));
      mesh.position.copy(pos);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.2) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(Math.random() * 6 + 2);

      this.scene.add(mesh);
      this.particles.push({ mesh, vel, life: 0.35, maxLife: 0.35, gravity: -10 });
    }
  }

  spawnMuzzleFlash(gunGroup) {
    const flashMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 })
    );
    flashMesh.position.set(0, 0.05, -0.6);
    gunGroup.add(flashMesh);
    this.muzzleFlashes.push({ mesh: flashMesh, parent: gunGroup, life: 0.04 });
  }

  update(delta) {
    // Screen trauma decay
    if (this.screenTrauma > 0) {
      this.screenTrauma = Math.max(0, this.screenTrauma - delta * 0.15);
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      p.vel.y += p.gravity * delta;
      p.mesh.position.addScaledVector(p.vel, delta);
      p.mesh.material.opacity = p.life / p.maxLife;

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }

    // Update Muzzle Flashes
    for (let i = this.muzzleFlashes.length - 1; i >= 0; i--) {
      const mf = this.muzzleFlashes[i];
      mf.life -= delta;
      if (mf.life <= 0) {
        mf.parent.remove(mf.mesh);
        this.muzzleFlashes.splice(i, 1);
      }
    }
  }
}
