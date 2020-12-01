import C from '/include/constants'
import sum from 'lodash-es/sum'
import values from 'lodash-es/values'


export default {
  builder (target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C.WORK)
    }
    target = { x: 25, y: 25, roomName: target }
    let tgt = this.resolveTarget(target)
    if (this.creep.pos.roomName !== tgt.roomName) {
      this.push('moveToRoom', tgt)
      return this.runStack()
    }
    let { room, pos } = this.creep
    console.log(room, this.roomName)
    if (this.creep.carry.energy) {
      this.status = 'Looking for target'
      let sites = room.find(C.FIND_MY_CONSTRUCTION_SITES)
      if (!sites.length) {
        this.push('suicide');
        return this.runStack();
      }
      sites = _.sortBy(sites, site => -site.progress / site.progressTotal)
      let site = _.first(sites)
      let hitsMax = Math.ceil(this.creep.carry.energy / (cache.work * C.BUILD_POWER))
      this.push('repeat', hitsMax, 'build', site.id)
      this.push('moveInRange', site.id, 3)
      this.runStack()
    } else {
      this.status = 'Looking for energy'
      let tgt = room.storage || room.containers.find(c => c.store.energy) ||  room.structures[STRUCTURE_SPAWN] || room.structures[STRUCTURE_SPAWN] || room.structures[STRUCTURE_EXTENSION]
      if(!tgt){
        tgt = C.USER.room.storage || C.USER.room.containers.find(c => c.store.energy) ||  C.USER.room.structures[STRUCTURE_SPAWN][0] || C.USER.room.structures[STRUCTURE_SPAWN] || C.USER.room.structures[STRUCTURE_EXTENSION]
      }
      if (room.storage && room.storage.store.energy < 1000) {
        let { x, y, roomName } = room.storage.pos
        this.push('repeat',5,'flee', [{ pos: { x, y, roomName }, range: 5 }])
        return this.runStack()
      }
      if (tgt) {
        //removed sleeping if theres queue in spawn as caused a loop crashing builder process
        if (tgt.structureType ===  STRUCTURE_CONTAINER || STRUCTURE_STORAGE) {
          this.push('withdraw', tgt.id, C.RESOURCE_ENERGY)
        this.push('moveNear', tgt.id)
        return this.runStack()
        } else if(tgt.structureType === STRUCTURE_SPAWN || STRUCTURE_EXTENSION && this.creep.room.spawn.queueLength == 0){
          this.push('withdraw', tgt.id, C.RESOURCE_ENERGY)
          this.push('moveNear', tgt.id)
          return this.runStack()
        }
      }
    }
    } 
  }

