import C from '/include/constants'

export default {
  upgrader(target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C.WORK)
    }
    const { room: {controller}} = this.creep
    if(this.creep.store.energy < this.creep.store.getCapacity(RESOURCE_ENERGY)){
    this.status = 'Looking for energy'
    let tgt = this.creep.room.storage || this.creep.room.containers.find(c => c.store.energy) || this.creep.room.structures[STRUCTURE_SPAWN] && this.creep.room.structures[STRUCTURE_SPAWN][0]
    if (!tgt) {
      tgt = C.USER.room.storage || C.USER.room.containers.find(c => c.store.energy) || C.USER.room.structures[STRUCTURE_SPAWN] && C.USER.structures[STRUCTURE_SPAWN][0]
    }
    this.push('withdraw', tgt.id, C.RESOURCE_ENERGY)
    this.push('moveNear', tgt.id)
    return this.runStack()
}
    if (this.creep.pos.roomName !== this.creep.memory.homeRoom) {
      let target = {
        x: 25,
        y: 25,
        roomName: this.creep.memory.homeRoom
      }
      let tgt = this.resolveTarget(target)
      this.push('moveToRoom', tgt)
      return this.runStack()
    }
    if (this.creep.carry.energy) {
      this.status = 'Upgrading'
      let upCnt = Math.ceil(this.creep.carry.energy / cache.work)
      this.push('repeat', upCnt, 'upgradeController', controller.id)
      this.push('moveInRange', controller.id, 3)
      this.runStack()
    } 
  }
}