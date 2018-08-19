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
    var temp1 = config.creepTypes
  }
  let avaliableCreeps = []

  let creepTypes = Object.entries(temp1)
  for(let i = 0; i < creepTypes.length; i++){
    if(creepTypes[0] == creepType) {
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
