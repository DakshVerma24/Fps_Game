// spatialGrid.js - Spatial Hash broad-phase partitioning with NaN safety guards
export class SpatialGrid {
  constructor(cellSize = 12) {
    this.cellSize = cellSize > 0 ? cellSize : 12;
    this.grid = new Map();
    this.allColliders = [];
  }

  _hash(cx, cz) {
    return `${cx}:${cz}`;
  }

  addCollider(collider) {
    if (!collider || typeof collider !== 'object') return;
    if (isNaN(collider.minX) || isNaN(collider.maxX) || isNaN(collider.minZ) || isNaN(collider.maxZ)) return;

    this.allColliders.push(collider);

    const minCX = Math.floor(collider.minX / this.cellSize);
    const maxCX = Math.floor(collider.maxX / this.cellSize);
    const minCZ = Math.floor(collider.minZ / this.cellSize);
    const maxCZ = Math.floor(collider.maxZ / this.cellSize);

    for (let x = minCX; x <= maxCX; x++) {
      for (let z = minCZ; z <= maxCZ; z++) {
        const key = this._hash(x, z);
        if (!this.grid.has(key)) {
          this.grid.set(key, []);
        }
        this.grid.get(key).push(collider);
      }
    }
  }

  query(x, z, radius = 2) {
    // Safety check: Fallback to all colliders if coordinates are not yet numbers
    if (typeof x !== 'number' || typeof z !== 'number' || isNaN(x) || isNaN(z)) {
      return this.allColliders;
    }

    const rad = (typeof radius === 'number' && !isNaN(radius)) ? radius : 2;
    const minCX = Math.floor((x - rad) / this.cellSize);
    const maxCX = Math.floor((x + rad) / this.cellSize);
    const minCZ = Math.floor((z - rad) / this.cellSize);
    const maxCZ = Math.floor((z + rad) / this.cellSize);

    const result = [];
    const seen = new Set();

    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cz = minCZ; cz <= maxCZ; cz++) {
        const key = this._hash(cx, cz);
        const list = this.grid.get(key);
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!seen.has(item)) {
              seen.add(item);
              result.push(item);
            }
          }
        }
      }
    }

    return result.length > 0 ? result : this.allColliders;
  }

  clear() {
    this.grid.clear();
    this.allColliders = [];
  }
}

export default SpatialGrid;
