module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    let closeSource = creep.pos.findClosestByPath(FIND_SOURCES);
    source = Game.getObjectById(closeSource.id);
    source.memory = creep.room.memory.sourceNodes[source.id]
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
};
