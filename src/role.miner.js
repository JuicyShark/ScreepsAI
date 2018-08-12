module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    source = Game.getObjectById(creep.memory.sourceId);
    let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
    })[0]
    // try to harvest energy, if the source is not in range
    if (creep.pos.isEqualTo(container.pos)) {
      creep.harvest(source)
    } else {
      creep.moveTo(container)
    }
  }
}
