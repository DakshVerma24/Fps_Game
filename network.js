import { getAudioContext } from './audio.js';

export const PEER_CONFIG = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  }
};

export class NetworkManager {
  constructor(roomCode, playerName, callbacks) {
    this.roomCode = roomCode.toUpperCase().trim() || 'SECTOR-7';
    this.playerName = playerName.trim();
    this.callbacks = callbacks; // { onPos, onDamage, onKill, onLobbySync, onStartMatch }
    this.hostPeerId = `cyberfps-host-${this.roomCode}`;
    this.peer = null;
    this.hostConn = null;
    this.clients = new Map();
    this.isHost = false;
    this.lobbyRoster = new Map();
    this.snapshotBuffers = new Map(); // peerId -> [{x, y, z, rotY, t}]
    this.connectAsClient();
  }

  connectAsClient() {
    const myId = `cyberfps-p-${this.roomCode}-${Math.floor(Math.random() * 1000000)}`;
    this.peer = new Peer(myId, PEER_CONFIG);

    this.peer.on('open', () => {
      const conn = this.peer.connect(this.hostPeerId, { reliable: true });
      let hostFound = false;

      conn.on('open', () => {
        hostFound = true;
        this.hostConn = conn;
        this.isHost = false;
        this.callbacks.onRoleChange(false);
        this.send({ type: 'joinLobby', id: this.peer.id, name: this.playerName });
        conn.on('data', (data) => this.handleData(data));
      });

      conn.on('close', () => {
        // Automatic Host Migration Trigger
        this.migrateToHost();
      });

      setTimeout(() => {
        if (!hostFound && !this.isHost) this.becomeHost();
      }, 1500);
    });

    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') this.connectAsClient();
    });
  }

  migrateToHost() {
    console.log('Host disconnected. Electing new host...');
    // Next lowest peer ID promotes to host
    let lowestId = this.peer.id;
    for (const id of this.lobbyRoster.keys()) {
      if (id < lowestId) lowestId = id;
    }
    if (lowestId === this.peer.id) {
      this.becomeHost();
    }
  }

  becomeHost() {
    if (this.peer) this.peer.destroy();
    this.peer = new Peer(this.hostPeerId, PEER_CONFIG);
    this.isHost = true;

    this.peer.on('open', () => {
      this.callbacks.onRoleChange(true);
      this.lobbyRoster.set(this.peer.id, { name: this.playerName, team: 'RED' });
    });

    this.peer.on('connection', (conn) => {
      conn.on('open', () => this.clients.set(conn.peer, conn));
      conn.on('data', (data) => {
        this.handleData(data);
        for (const [id, c] of this.clients.entries()) {
          if (id !== conn.peer && c.open) c.send(data);
        }
      });
      conn.on('close', () => {
        this.clients.delete(conn.peer);
        this.lobbyRoster.delete(conn.peer);
      });
    });
  }

  send(packet) {
    const json = JSON.stringify(packet);
    if (this.isHost) {
      for (const c of this.clients.values()) if (c.open) c.send(json);
    } else if (this.hostConn && this.hostConn.open) {
      this.hostConn.send(json);
    }
  }

  handleData(raw) {
    try {
      const d = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (d.type === 'pos') {
        if (!this.snapshotBuffers.has(d.id)) this.snapshotBuffers.set(d.id, []);
        const buf = this.snapshotBuffers.get(d.id);
        buf.push({ x: d.x, y: d.y, z: d.z, rotY: d.rotY, hp: d.hp, team: d.team, name: d.name, t: performance.now() });
        if (buf.length > 10) buf.shift();
      } else if (d.type === 'damage') {
        this.callbacks.onDamage(d);
      } else if (d.type === 'killSync') {
        this.callbacks.onKill(d);
      } else if (d.type === 'lobbySync') {
        this.callbacks.onLobbySync(d);
      } else if (d.type === 'startMatch') {
        this.callbacks.onStartMatch(d);
      }
    } catch (e) {}
  }

  getInterpolatedPlayer(peerId, renderTime) {
    const buf = this.snapshotBuffers.get(peerId);
    if (!buf || buf.length < 2) return buf && buf.length ? buf[buf.length - 1] : null;

    const targetTime = renderTime - 100; // 100ms interpolation delay
    let i = buf.length - 1;
    while (i > 0 && buf[i].t > targetTime) i--;

    const p0 = buf[i];
    const p1 = buf[i + 1] || p0;
    const t0 = p0.t, t1 = p1.t;
    const alpha = t1 === t0 ? 0 : Math.max(0, Math.min(1, (targetTime - t0) / (t1 - t0)));

    return {
      name: p1.name, team: p1.team, hp: p1.hp,
      x: p0.x + (p1.x - p0.x) * alpha,
      y: p0.y + (p1.y - p0.y) * alpha,
      z: p0.z + (p1.z - p0.z) * alpha,
      rotY: p0.rotY + (p1.rotY - p0.rotY) * alpha
    };
  }
}
