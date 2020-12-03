import C from '/include/constants'

export default {
  harvester (target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C.WORK)
    }
    let tgt = this.resolveTarget(target)
    if (!this.creep.pos.isNearTo(tgt)) {
      this.push('moveNear', target)
      return this.runStack()
    }
    if (tgt instanceof Source) {
      if (tgt.energy) {
        this.push('repeat', this.creep.ticksToLive, 'harvest', tgt.id)
        this.push('moveNear', tgt.id)
      } else {
        this.push('sleep', Game.time + tgt.ticksToRegeneration)
      }
      this.runStack()
    }
    if (tgt instanceof Mineral) {
      let [extractor] = tgt.pos.lookFor(C.LOOK_STRUCTURES)
      if (!extractor) {
        this.push('sleep', 5)
        this.say('No Extr')
      }
      if (extractor.cooldown) {
        this.push('sleep', Game.time + extractor.cooldown)
        return this.runStack()
      }
      if (tgt.mineralAmount) {
        this.push('sleep', C.EXTRACTOR_COOLDOWN)
        this.push('harvest', tgt.id)
        this.push('moveNear', tgt.id)
      } else {
        this.push('sleep', Game.time + tgt.ticksToRegeneration)
      }
      this.runStack()
    }
  }
}
