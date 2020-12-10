import C from '/include/constants'
import sum from 'lodash-es/sum'
import values from 'lodash-es/values'
import {
  findStorage
} from '/etc/common'

export default {
  collector(target, resourceType) {
    this.status = `idle ${resourceType} collector`
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
    let resources
      if(resourceType == 'score'){
        if(!target){
         score = this.creep.room.find(FIND_SCORE_CONTAINERS, {
          filter: (i) => i.store[RESOURCE_SCORE]
        });
        if(!score[0])
        target = score[0].id
        else this.creep.suicide()
      }
        this.status = 'withdraw'
        this.push('withdraw', target, resourceType)
        this.push('moveNear', target)
        return this.runStack()
      } else {
         resources = this.creep.room.lookNear(C.LOOK_RESOURCES, tgt.pos)
        .filter(r => r.resourceType === resourceType)
      }
    if (resources[0]) {
      if (resources[0].amount > 49) {
        this.status = 'sweeping up resource'
        this.push('pickup', resources[0].id)
        this.push('moveNear', resources[0].id)
        return this.runStack()
      } else {
        this.status = 'waiting for more resource'
        this.push('sleep', Game.time + 10)
        this.push('moveNear', resources[0].id)
      }
    }
    let [cont] = this.creep.room.lookNear(C.LOOK_STRUCTURES, tgt.pos)
      .filter((s) => s.structureType === (C.STRUCTURE_CONTAINER) && s.store[resourceType])
    if (cont) {
      if (cont.structureType === C.STRUCTURE_CONTAINER) {
        if (cont.store[resourceType] < this.creep.carryCapacity) {
          this.status = 'sleeping'
          this.push('sleep', Game.time + 5)
        }
        this.status = 'withdraw'
        this.push('withdraw', cont.id, resourceType)
        this.push('moveNear', cont.id)
        return this.runStack()
      }
    }
  }
}