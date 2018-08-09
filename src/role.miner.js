module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

        let closeSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        source = Game.getObjectById(closeSource.id);
      source.memory = this.room.memory.sourceNodes[source.id]
        let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: (s) => s.structureType == STRUCTURE_CONTAINER
        })[0]
        // try to harvest energy, if the source is not in range
        if (this.pos.isEqualTo(container.pos)) {
          source.memory.workers = +1
          this.harvest(source)
        }else{
          this.moveTo(container)
        }
};
