var config = require("config")

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
  }
  let avaliableCreeps = []

  let creepTypes = this.memory.creepsByType;
  for(let i = 0; i < creepTypes.length; i++){
    if(creepTypes[i].type == creepType) {
    let temp2 = creepTypes[i]

    if(temp2.length >= 2) {
      temp2.shift()
      var potentialCreep = Game.getObjectById(temp2)
      //console.log("Type " + creepType)
    if(potentialCreep != null || potentialCreep != undefined){
      if(potentialCreep.memory.task.length == 0){
        if(potentialCreep.memory.type == creepType) {
          console.log(potentialCreep.memory.type)
         avaliableCreeps.push(potentialCreep)
       }
      }
    }
    }
    else if (temp2.length == 1){

    }
  }
  }
  //console.log(avaliableCreeps)
  return avaliableCreeps
}
