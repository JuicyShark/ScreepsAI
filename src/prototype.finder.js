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
  if(this.memory.creepsByType == null) {

  } else {

    console.log(Yea)
  }
}
