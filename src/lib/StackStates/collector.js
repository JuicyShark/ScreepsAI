import C from '/include/constants'
import sum from 'lodash-es/sum'
import values from 'lodash-es/values'
import {
  findStorage
} from '/etc/common'

export default {
  collector(target, resourceType = C.RESOURCE_ENERGY) {
    this.status = 'idle collector'
    let tgt = this.resolveTarget(target)
    if (!this.creep.carryCapacity) {
      this.status = 'dying'
      this.creep.say('No CARRY', true)
      this.push('suicide')
      return this.runStack()
    }
    if (sum(values(this.creep.carry)) === this.creep.carryCapacity) {
      this.status = 'storing'
      this.push('store', resourceType)
      return this.runStack()
    }
    if (!this.creep.pos.inRangeTo(tgt, 3)) {
      this.status = 'traveling'
      this.log.info(`moveInRange`)
      this.push('moveInRange', target, 3)
      return this.runStack()
    }
    let resources = this.creep.room.lookNear(C.LOOK_RESOURCES, tgt.pos)
      .filter(r => r.resourceType === resourceType)
    if (resources[0]) {
      if (resources[0].amount > 49) {
        this.status = 'sweeping up resource off the ground'
        this.push('pickup', resources[0].id)
        this.push('moveNear', resources[0].id)
        return this.runStack()
      }
    }
    let storage = findStorage(this.creep)
    if (storage.structureType === C.STRUCTURE_CONTAINER) {
      if (storage.store[resourceType] < this.creep.carryCapacity) {
        this.status = 'sleeping'
        this.push('sleep', Game.time + 5)
        this.push('repeat',3,'flee', [{ pos: storage.pos, range: 5 }])
      }
      this.status = 'withdraw'
      this.push('withdraw', storage.id, resourceType)
      this.push('moveNear', storage.id)
      return this.runStack()
    }
  }
}