import C from '/include/constants'

export default {
  upgrader (target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C.WORK)
    } 
    target = { x: 25, y: 25, roomName: this.creep.memory.homeRoom}
   let tgt = this.resolveTarget(target)
   if(this.creep.pos.roomName !== tgt.roomName){
      this.push('moveToRoom', tgt)
     return this.runStack()
    }
    const { room, pos, room: { controller } } = this.creep
    if (this.creep.carry.energy) {
      this.status = 'Upgrading'
      let upCnt = Math.ceil(this.creep.carry.energy / cache.work)
      this.push('repeat', upCnt, 'upgradeController', controller.id)
      this.push('moveInRange', controller.id, 3)
      this.runStack()
    } else {
      this.status = 'Looking for energy'
      let tgt = room.storage || room.containers.find(c => c.store.energy) || room.structures[STRUCTURE_SPAWN] && room.structures[STRUCTURE_SPAWN]
      if(!tgt){
       tgt = C.USER.room.storage || C.USER.room.containers.find(c => c.store.energy) || C.USER.room.structures[STRUCTURE_SPAWN] && C.USER.room.structures[STRUCTURE_SPAWN]
      }
      else (tgt) 
        if (tgt.structureType === 'storage' && tgt.store.energy < 10000 && (!controller.ticksToDowngrade || controller.ticksToDowngrade < 10000)) {
          this.push('sleep', Game.time + 10)
          return this.runStack()
        }
        this.push('withdraw', tgt.id, C.RESOURCE_ENERGY)
        this.push('moveNear', tgt.id)
        return this.runStack()
      
    }
  }
}
