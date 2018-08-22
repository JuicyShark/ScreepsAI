require("prototype.spawn")
require("prototype.finder")
var _ = require('lodash');
var config = require("config")


/** @function createTask
    @param {string} name  // String name of the task,     example: HARVEST
    @param {string} id  //      please do this   var id = details.target + i + Game.time .... ensure ID is unique
    @param {string} typeNeeded  // String of the Type of body needed for task,       example: ALL_ROUND
    @param {number} priority  // number of the priority of tasks assign tasks starting from one first
    @param {object} details   // further details of the task including target/s and any id's of things associated
   // create a task to assign in a queue
    */
Room.prototype.createTask = function(name,  typeNeeded, priority, details) {
  var task = {
    name: name,
    typeNeeded: typeNeeded,
    priority: priority,
    details: details
  }
  var duplicateTask = null;
    for (var i in Game.creeps) {
      if( duplicateTask == true) break;
      if (Game.creeps[i].memory.task != null || Game.creeps[i].memory.task != undefined){
        if(Game.creeps[i].memory.task.details.target == task.details.target){

             duplicateTask = true;
         }
       }
    }
    for (var i in this.memory.taskList) {
      if( duplicateTask == true) break;
      if ( this.memory.taskList[i].details.target == task.details.target){
           duplicateTask = true;

         }
    }
  if (duplicateTask != true ) {
    this.memory.taskList.push(task)
  }
}

Room.prototype.assignTasks = function() {

  var tooManyTask = []

  for(var i in this.memory.creepsByType){
    let creepsBytype = this.memory.creepsByType[i]
    for(var a in creepsBytype.creeps) {
      let chosenOne = Game.getObjectById(creepsBytype.creeps[a])
      if(chosenOne instanceof Creep) {
        if(chosenOne.memory.task == null ){
          let thisCreepType = chosenOne.memory.type
          var newTask = this.filtertask(thisCreepType)
          if(newTask != null || newTask != undefined) {
            chosenOne.memory.task == newTask
          }
        }
      }
    }
  }


}

Room.prototype.checkTask = function(type) {

}

Room.prototype.constantTasks = function() {
  for (let i in this.memory.sourceNodes) {
    let thisSourceID = this.memory.sourceNodes[i].id;
      if(this.memory.sourceNodes[i].container == ""){
        let details = { target: thisSourceID }
        if(thisSourceID != null){
        this.createTask("HARVEST", "ALL_ROUND", 1, details)}
    } else if (this.memory.sourceNodes[i].container != "") {
        let thisSourceContainer = this.memory.sourceNodes[i].container;
        let details = { target: thisSourceContainer, sourceId: thisSourceID}
        this.createTask("CONTAINER_MINE", "CONTAINER_MINER", 1, details )
    }
  }

  if(this.memory.structureIDs.controller.id != "") {
    details = { target: this.memory.structureIDs.controller.id }
    this.createTask("UPGRADE", "UPGRADER", 1, details)
  }
  if(this.memory.structureIDs.Spawns.length >= 1){
      details = {target: this.memory.structureIDs.Spawns[0] }
      this.createTask("REPAIR", "ALL_ROUND", 2, details)
    }
    if(this.memory.structureIDs.Towers.length >= 1){
        details = {target: this.memory.structureIDs.Towers[0] }
        this.createTask("REPAIR", "ALL_ROUND", 1, details)
      }
    }


Room.prototype.isMine = function() {
  return this.controller && this.controller.my;
}

Room.prototype.alertLevel = function() {
  let hostiles = this.find(FIND_HOSTILE_CREEPS, {
    filter: {
      owner: {
        username: !config.allies.username
      }
    }
  });
  if (hostiles.size() >= 1) {
    this.safeGuardUp()
    return 2;
  }
}

Room.prototype.processAsGuest = function() {

}



Room.prototype.needSourceScouts = function() {
  let scoutRoomFlags = [];
  for (i in Memory.flags) {
    if (Memory.flags[i].needScout) {
      scoutRoomFlags.push(Memory.flags[i].id)
      scoutRoomFlags.push(Memory.flags[i])
    }
  }
  if (scoutRoomFlags.length != 0) {
    return scoutRoomFlags;
  } else {
    return false;
  }
}

Room.prototype.needBasicWorker = function() {
  if(this.memory.creepsByType.allRound.creeps.length == 0) {
    return true
  }
  if(this.memory.creepsByType.allRound.creeps.length >= 3 && this.needContainerMiner() == true){
    return false
  }
  else if (this.memory.creepsByType.allRound.creeps.length > 4) {
    return false
  }
  else if(this.memory.creepsByType.allRound.creeps.length <= 3 && this.needContainerMiner() == false){
    return true
  }
  else if(this.memory.creepsByType.allRound.creeps.length <= 6 && this.level() >= 5) {
    return true
  }
}
// Testing to only want harvesters if we dont have miners and lorrys around
Room.prototype.needLorry = function() {
  if(this.memory.creepsByType.containerMiner.creeps.length == 0) {
    return false
  } else if (this.memory.creepsByType.containerMiner.creeps.length != 0) {
    if (this.memory.creepsByType.lorry.creeps.length <= 2 ) {
      return true
    }
  }

}

Room.prototype.needUpgrader = function() {
  if(this.memory.creepsByType.upgrader.creeps.length >= 3){
    return false;
  } else if (this.memory.creepsByType.upgrader.creeps.length <=2) {
    return true;
  }
}
Room.prototype.needContainerMiner = function() {
  let output = []
  for (let i in this.memory.sourceNodes) {
    let thisSourceID = this.memory.sourceNodes[i].id;
      if(this.memory.sourceNodes[i].container == ""){

    } else if (this.memory.sourceNodes[i].container != "") {
        output.push(thisSourceID)
    }
  }
  if(this.memory.creepsByType.containerMiner.creeps.length >= output.length){
    return false
  } else if (this.memory.creepsByType.containerMiner.creeps.length <= output.length) {
    return true
  }
}

Room.prototype.needDefender = function() {
  /*  if () {
      return true
    }
    else {
      return false
    }*/
}

Room.prototype.needRangedAttacker = function() {
  return false
  //attacking logic
}

Room.prototype.needBrawler = function() {

  return false
  //attacking logic
}

Room.prototype.needMedic = function() {
  return false
  //attacking logic
}

Room.prototype.needClaimer = function() {
  if (this.energyCapacityAvailable >= 700) {
    for (let i in Memory.flags) {
      let = thisFlag = Memory.flags[i]
      if (thisFlag.name == "ClaimRoom" && thisFlag.hasClaimer == false) {
        var spawn = this.find(FIND_MY_SPAWNS)
        spawn[0].spawnClaimer(roomName, thisFlag)
      }
    }
    return true;
  } else {
    return false;
  }
}
