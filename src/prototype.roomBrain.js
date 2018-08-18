require("prototype.spawn")
var config = require("config")


//Work in progress and not applied anywhere yet


/** @function createTask
    @param {string} name  // String name of the task,                                example: TASK_HARVEST
    @param {string} typeNeeded  // String of the Type of body needed for task,       example: TYPE_ALLROUND
    @param {number} priority  // number of the priority of tasks assign tasks starting from one first
    @param {object} details   // further details of the task including target/s and any id's of things associated
   // create a task to assign in a queue
    */
Room.prototype.createTask = function(name, typeNeeded, priority, details) {
  var task = {
    name: name,
    typeNeeded: typeNeeded,
    priority: priority,
    details: details
  }
  var duplicateTask = null;
    for (var i in Game.creeps) {
      if( duplicateTask == true) break;
      if (Game.creeps[i].memory.task[0] != null){
        if(Game.creeps[i].memory.task[0].details.target == task.details.target){

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

Room.prototype.assignTask = function() {

}

Room.prototype.checkTask = function(type) {

}

Room.prototype.filterTasks = function(taskName) {

  for (var i in this.memory.taskList){
     if(this.memory.taskList[i].name == taskName){
      var  filteredTask = this.memory.taskList[i]
        this.memory.taskList.splice(i, 1);
        return filteredTask
     }
  }

}


Room.prototype.findBuilder = function() {
  var potentialCreeps = []
  for (let i in this.creepsAllRound) {
    var potentialCreep = this.creepsAllRound[i]
    if (potentialCreep.memory.task[0] == null) {
      console.log(potentialCreep)
    potentialCreeps.push(potentialCreep)
    }
  }
if (potentialCreeps.length >= 1)
  return potentialCreeps
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
  console.log("Im just a Guest here! " + this.name)
  let roomFlags = this.find(FIND_FLAGS, {
    filter: {
      name: "HarvestSources"
    }
  });
  if (roomFlags != undefined) {
    console.log("FLAG!")
  }
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
  let harvesters = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "harvester"
      }
    }
  });
  let miners = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "miner"
      }
    }
  });
  let lorrys = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "lorry"
      }
    }
  });
  if (miners.length >= 2 && lorrys.length >= 2) {
    return false;
  } else if (harvesters.length == null || harvesters == 0) {
    console.log("need worker")
    return true;
  } else if (this.needContainerMiner()) {
    return false;
  }

}
// Testing to only want harvesters if we dont have miners and lorrys around
Room.prototype.needLorry = function() {
  let lorrys = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "lorry"
      }
    }
  });
  let miners = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "miner"
      }
    }
  });
  if (miners.length >= 1 && lorrys.length < config.maxLorrys[this.level()]) {
    return true
  } else if (lorrys.length > config.maxLorrys[this.level()]) {
    return false;
  }
}

Room.prototype.needRepairer = function() {
  let repairer = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "repairer"
      }
    }
  });
  if (repairer.length <= config.maxRepairers[this.level()]) {
    return true
  }
}

Room.prototype.needUpgrader = function() {
  let upgrader = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "upgrader"
      }
    }
  });
  if (upgrader.length <= config.maxUpgraders[this.level()]) {
    return true
  }
}

Room.prototype.needBuilder = function() {
  let builder = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "builder"
      }
    }
  });
  if (builder.length <= config.maxBuilders[this.level()]) {
    return true;
  }
}

Room.prototype.needContainerMiner = function() {
  for (var i in this.memory.sourceNodes) {
    if (this.memory.sourceNodes[i].miners == 0 && this.memory.sourceNodes[i].container != "") {
      return true
    }
    if (this.memory.sourceNodes[i].miners == 1) {
      return false
    }
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
