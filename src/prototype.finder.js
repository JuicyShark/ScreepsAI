var config = require("config")

/** @function findType
    @param {string} type  type of creep you want to search for
    @return {array} array of creeps
    **/
Room.prototype.findType = function(type) {
  var creeps = null
  creeps = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        type: type
      }
    }
  });
  return creeps
}

/** @function filtertask
    @param {string} typeGiven the type task to look for
    @return {object}  task with highest priority
    **/
Room.prototype.filtertask = function(typeGiven) {
  this.memory.taskList.sort(function(a,b){
    if (a.priority < b.priority)
      return -1;
    if (a.priority > b.priority)
      return 1;
    return 0;
  })
  for (var i in this.memory.taskList){
     if(this.memory.taskList[i].typeNeeded == typeGiven){
      var  filteredTask = this.memory.taskList[i]
        this.memory.taskList.splice(i, 1);
        return filteredTask
     }
  }
}

/** @function ConvertsToLocation
    @param {string} RoomName
    @return {X:"", Y:""}
    **/
Room.prototype.getRoomLocation = function(roomName) {
  let temp1 = [];
  let thisString = roomName.split("");
  for (let i = 0; i < thisString.length; i++) {
    let result = thisString[i];
    if (result == "W" || result == "S") {
      temp1.push("-")
    } else if (result == "E" || result == "N") {
      temp1.push("+")
    } else {
      temp1.push(result)
    }
  }
  let temp2 = temp1.join("");
  let outX = temp2.slice(0, 3);
  let outY = temp2.slice(3, 6)
  var output = {
    x: outX,
    y: outY
  }
  return output;
}
