module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    if(creep.memory.task != null || creep.memory.task != undefined){
      let container = creep.memory.task.details.target
      let sourceId = creep.memory.task.details.sourceId
      var source = Game.getObjectById(sourceId)
      var thisContainer = Game.getObjectById(container);

      if (thisContainer != null) {
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.ourPath(thisContainer)
        }
      }
    }
  }
}
