// Spatial Grid broad-phase partitioning for O(1) collision queries
export class SpatialGrid {
  constructor(cellSize = 12) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  _hash(cx, cz) {
    return `${cx}:${cz}`;
  }

  addCollider(collider) {
    const minCX = Math.floor(collider.minX / this.cellSize);
    const maxCX = Math.floor(collider.maxX / this.cellSize);
    const minCZ = Math.floor(collider.minZ / this.cellSize);
    const maxCZ = Math.floor(collider.maxZ / this.cellSize);

    for (let x = minCX; x <= maxCX; x++) {
      for (let z = minCZ; z <= maxCZ; z++) {
        const key = this._hash(x, z);
        if (!this.grid.has(key)) this.grid.set(key, []);
        this.grid.get(key).push(collider);
      }
    }
  }

  query(x, z, radius = 2) {
    const minCX = Math.floor((x - radius) / this.cellSize);
    const maxCX = Math.floor((x + radius) / this.cellSize);
    const minCZ = Math.floor((z - radius) / this.cellSize);
    const maxCZ = Math.floor((z + radius) / this.cellSize);

    const candidates = new Set();
    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cz = minCZ; cz <= maxCZ; cz++) {
        const key = this._hash(cx, cz);
        const list = this.grid.get(key);
        if (list) {
          for (let i = 0; i < list.length; i++) candidates.add(list[i]);
        }
      }
    }
    return Array.from(candidates);
  }
}s
