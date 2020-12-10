import C from '/include/constants'
import sum from 'lodash-es/sum'
import values from 'lodash-es/values'


export default {
  builder(target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C.WORK)
    }
    if (this.creep.store.energy < this.creep.store.getCapacity(RESOURCE_ENERGY)) {
      this.status = 'Looking for energy'
      let storage = this.creep.room.storage || this.creep.room.containers.find(c => c.store.energy) || this.creep.room.structures[STRUCTURE_SPAWN] && this.creep.room.structures[STRUCTURE_SPAWN][0]
      if (!storage) {
        storage = C.USER.room.storage || C.USER.room.containers.find(c => c.store.energy) || C.USER.room.structures[STRUCTURE_SPAWN] && C.USER.structures[STRUCTURE_SPAWN][0]
      }
      if (this.creep.room.storage && this.creep.room.storage.store.energy < 1000) {
        this.push('repeat', 5, 'flee', [{
          pos: this.creep.room.storage.pos,
          range: 5
        }])
        return this.runStack()
      }
      if (storage) {
        if (storage.structureType === STRUCTURE_CONTAINER || STRUCTURE_STORAGE) {
          this.push('withdraw', storage.id, C.RESOURCE_ENERGY)
          this.push('moveNear', storage.id)
          return this.runStack()
        } else if (storage.structureType === STRUCTURE_SPAWN || STRUCTURE_EXTENSION && this.creep.room.spawn.queueLength == 0) {
          this.push('withdraw', storage.id, C.RESOURCE_ENERGY)
          this.push('moveNear', storage.id)
          return this.runStack()
        }
      }
    }
    target = {
      x: 25,
      y: 25,
      roomName: target
    }
    let tgt = this.resolveTarget(target)
    if (this.creep.pos.roomName !== tgt.roomName) {
      this.status = `Moving to room ${tgt.roomName}`
      this.push('moveToRoom', tgt)
      return this.runStack()
    }
    if (this.creep.carry.energy) {
      this.status = 'Looking for target'
      let sites = this.creep.room.find(C.FIND_MY_CONSTRUCTION_SITES)
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
    }
  }
}