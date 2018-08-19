

Room.prototype.findType = function(type) {
  var creeps = null
  creeps = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        type: type
      }
    }
  });
    //console.log(creeps)

  return creeps
}




Room.prototype.checkBuilders = function() {
    var avaliableCreeps = []
      for(let i in this.memory.creepsByType.allRound){
        var potentialCreep = this.memory.creepsByType.allRound[i]
      if(potentialCreep.memory.task.length == 0){
        avaliableCreeps.push(potentialCreep)
      }
    }
    return avaliableCreeps 
}
Room.prototype.checkContainerMiners = function() {
  var avaliableCreeps = []
    for(let i in this.memory.creepsByType.containerMiner){
      var potentialCreep = this.memory.creepsByType.containerMiner[i]
    if(potentialCreep.memory.task.length == 0){
      avaliableCreeps.push(potentialCreep)
    }
  }
  return avaliableCreeps
    }
