

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


Room.prototype.checkAvaliableCreeps = function (creepType) {
  if (!creepType) {
    console.log("Not Defined")
  } else {
    var temp1 = this.memory.creepsByType
  }
  let avaliableCreeps = []


  for(let i in temp1){
    var potentialCreep = Game.getObjectById(temp1[i])
  if(potentialCreep != null){


    if(potentialCreep.memory.task.length == 0){
    avaliableCreeps.push(potentialCreep)
    }
    }
  }
  return avaliableCreeps
}
