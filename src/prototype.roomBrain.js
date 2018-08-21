require("prototype.spawn")
require("prototype.finder")
var _ = require('lodash');
var config = require("config")


//Work in progress and not applied anywhere yet


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
      if (Game.creeps[i].memory.task != null){
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
  var needTask = []

  var tooManyTask = []

  for(var i in this.memory.creepsByType){
    let creepsBytype = this.memory.creepsByType[i]
    for(var a in creepsBytype.creeps) {
      let chosenOne = Game.getObjectById(creepsBytype.creeps[a])
      if(chosenOne instanceof Creep) {
        if(chosenOne.memory.task.length == 0 ){
          needTask.push(chosenOne);
        }
      }
    }
  }
  if(needTask.length != 0) {
    for(var o in needTask){
      let thisCreep = needTask[o]
      if(thisCreep instanceof Creep) {
        let thisCreepType = thisCreep.memory.type
        var newTask = this.filterTasks(thisCreepType)
        if(newTask != null || newTask != undefined) {
          thisCreep.memory.task.push(newTask)
        }
    }
    }
  } else if (needTask.length == 0) {
    console.log("everyone working? ")
  }

}

Room.prototype.checkTask = function(type) {

}

Room.prototype.constantTasks = function() {

  for (let i in this.memory.sourceNodes) {
    if(this.memory.sourceNodes[i].taskInit == false){
      details = {target: this.memory.sourceNodes[i].id}
      this.createTask("HARVEST", "ALL_ROUND", 1, details)
      this.memory.sourceNodes[i].taskInit = true;
    }
  }
  if(this.memory.structureIDs.controller.taskInit == false) {
    details = {target: this.memory.structureIDs.controller.id}
    this.createTask("UPGRADE", "UPGRADER", 1, details)
    this.memory.structureIDs.controller.taskInit = true;
  }
  if(this.memory.structureIDs.Containers.length >= 1){
    details = {target: this.memory.structureIDs.Containers[0].id}
    this.createTask("REPAIR", "ALL_ROUND", 4, details)
  }
}

Room.prototype.filterTasks = function(typeGiven) {
  for (var i in this.memory.taskList){
     if(this.memory.taskList[i].typeNeeded == typeGiven){
       //console.log(this.memory.taskList[i].name + " " + taskName)
      var  filteredTask = this.memory.taskList[i]
        this.memory.taskList.splice(i, 1);
        return filteredTask
     }
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
Room.prototype.roomHarvesters = function() {
  let harvesters = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        type: "ALL_ROUND"
      }
    }
  });
  return harvesters;
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
  else if(this.memory.creepsByType.allRound.creeps.length <= 4 && this.level() <= 2) {
    return true
  }
  else if(this.memory.creepsByType.allRound.creeps.length <= 6 && this.level() >= 3) {
    return true
  }
}
// Testing to only want harvesters if we dont have miners and lorrys around
Room.prototype.roomLorrys = function() {
  let lorrys = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "lorry"
    }}
  });
  return lorrys;
}
Room.prototype.needLorry = function() {
  if (this.roomMiners().length >= 1 && this.roomLorrys().length <= 2 ) {
    return true
  }
}

Room.prototype.needUpgrader = function() {
  if(this.memory.creepsByType.upgrader.creeps.length >= 1 && this.memory.structureIDs.controller.taskInit == true){
    return false;
  } else if (this.memory.creepsByType.upgrader.creeps.length == 0) {
    return true;
  }
}

Room.prototype.roomBuilders = function() {
  let builder = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "builder"
      }}
  });
  return builder;
}
Room.prototype.needBuilder = function() {

  if (this.memory.constructionSites.length != 0 && this.roomBuilders().length < 1) {
    return true;
  }
}
Room.prototype.roomMiners = function() {
  let minersObj = []
  let miner = this.memory.creepsByType.containerMiner.creeps
  for(let i in miner) {
    let myMiner = Game.getObjectById(miner[i])
    if(myMiner instanceof Creep) {
      minersObj.push(myMiner)
    }
  }
  return minersObj;
}
Room.prototype.needContainerMiner = function() {

  let output = [];
  let tempy = Object.keys(this.memory.sourceNodes)
  if(this.roomMiners().length >= tempy.length) {
    console.log("MinerFalsy bc of sourcenode cap" + this.roomMiners().length)
    return false
  }
  for (let i in this.memory.sourceNodes) {

    let thisSource = this.memory.sourceNodes[i];
    if(thisSource.miner == "waiting" && thisSource.container != "") {
      output.push(thisSource)
    }
  }
    if (output.length != 0) {
      let selectedSource = output.pop()
      if (selectedSource.container != "") {
      details = {target: selectedSource.container, sourceId: selectedSource.id}
      this.createTask("CONTAINER_MINE", "CONTAINER_MINER", 1, details )
      return true
      }
    } else if (output.length == 0) {
      return false
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
