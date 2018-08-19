

Room.prototype.findType = function(type) {
  var creeps = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        type: type
      }
    }
  });
  console.log(creeps, type)
  return creeps
}

Room.prototype.findBuilder = function() {
  var potentialCreeps = []
  for (let i in this.memory.creepsByType.allRound) {
    var potentialCreep = Game.getObjectById(this.memory.creepsByType.allRound[i])
    if (potentialCreep.memory.task[0] == null) {
    potentialCreeps.push(potentialCreep)
    }
  }
if (potentialCreeps.length >= 1)
  return potentialCreeps
}

Room.prototype.findContainerMiner = function() {
  var potentialCreeps = [];
  for (let i in this.memory.creepsByType.containerMiner) {
    var potentialCreep = Game.getObjectById(this.memory.creepsByType.containerMiner[i])
    if (potentialCreep.memory.task[0] == null) {
    potentialCreeps.push(potentialCreep)
    }
  if (potentialCreeps.length >= 1)
  //console.log(potentialCreeps)
    return potentialCreeps
  }
}
