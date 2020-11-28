import C from '/include/constants'
import IFF from '/lib/IFF'

export default {
  protector (target, cache = {}) {
    target = { x: 25, y: 25, roomName: target }
    const tgt = this.resolveTarget(target)
    if (this.creep.pos.roomName !== tgt.roomName) {
      this.push('moveToRoom', tgt)
      return this.runStack()
    }
    const { room, pos } = this.creep
    const walls = room.find(C.FIND_STRUCTURES, {filter: (s) =>s.structureType === STRUCTURE_WALL})
    const hostiles = room.find(C.FIND_HOSTILE_CREEPS) || room.find(C.FIND_HOSTILE_STRUCTURES || walls.length);
    const hostile = pos.findClosestByRange(hostiles || walls)
    this.push('attack', hostile.id || walls.id)
    this.push('moveNear', hostile.id  || walls.id)
    this.runStack()
  }
}
