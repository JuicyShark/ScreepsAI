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
Room.prototype.createTask = function(name, typeNeeded, priority, details) {
  var task = {
    name: name,
    typeNeeded: typeNeeded,
    priority: priority,
    details: details
  }
  var duplicateTask = null;
  for(let i in Game.creeps) {
    if (Game.creeps[i] instanceof Creep){
      if (duplicateTask == true){break;}
      else {
        if(Game.creeps[i].spawning != true){
        if (Game.creeps[i].memory.task != null || Game.creeps[i].memory.task != undefined) {
        if (Game.creeps[i].memory.task.details.target == task.details.target) {
          duplicateTask = true;
        }
      }}
    }
    }
    }
/*  for (var i = 0; i < Object.keys(Game.creeps).length; i++) {
    console.log("HEREEEE")
    if(Object.keys(Game.creeps)[i] instanceof Creep){
    console.log("CREEP " + Object.keys(Game.creeps)[i].name)
    if (duplicateTask == true) break;
    if (Game.creeps[i].memory.task != null || Game.creeps[i].memory.task != undefined) {
      console.log(task.name +" PASSED FIRST")
      if (Game.creeps[i].memory.task.details.target == task.details.target) {
        console.log(task.name)

        duplicateTask = true;
      }
    }
    }
  }*/
  for (var i = 0; i < this.memory.taskList.length; i++) {
    if (duplicateTask == true) break;
    if (this.memory.taskList[i].details.target == task.details.target) {
      duplicateTask = true;

    }
  }
  if (duplicateTask != true) {
    this.memory.taskList.push(task)
  }
}

Room.prototype.constantTasks = function() {

      for (var i = 0; i < Object.keys(this.memory.sourceNodes).length; i++) {
      let thisSourceID = Object.values(this.memory.sourceNodes)[i].id;
      if (Object.keys(this.memory.sourceNodes)[i] != null) {


      if (Object.values(this.memory.sourceNodes)[i].container != null || Object.keys(this.memory.sourceNodes)[i].container != undefined) {
        let thisSourceContainer = Object.values(this.memory.sourceNodes)[i].container;
        let details = {
          target: thisSourceContainer,
          sourceId: thisSourceID
        }
        this.createTask("CONTAINER_MINE", "CONTAINER_MINER", 1, details)
        }


      let details1 = {
          target: thisSourceID
        }
        this.createTask("HARVEST", "ALL_ROUND", 1, details1)

    }
  }

    if (this.memory.structureIDs.controller.id != null) {
      let creep = Game.getObjectById(this.memory.availableCreeps[0])
      if(creep != null) {
      if(creep.memory.type == "UPGRADER") {
        details = {
            target: this.memory.availableCreeps[0]
          }
          this.createTask("UPGRADE", "UPGRADER", 1, details)
      }
    }
    }

    for (var s of this.find(FIND_STRUCTURES, {
        filter: function(i) {
          return i.needsRepair(true);
        }
      })) {
        let details = {
          target: s.id
        }
      if (!s instanceof StructureWall && !s instanceof StructureRampart) {
        let task = this.createTask('REPAIR', "ALL_ROUND", 3, details);
      } else {

        let task = this.createTask('REPAIR', "ALL_ROUND", 4, details);
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
      for (var i = 0; i < Memory.flags.length; i++) {
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
      if (this.memory.creepsByType.allRound.creeps.length == 0) {
        return true
      }  else if (this.memory.creepsByType.allRound.creeps.length >= 3 && this.needContainerMiner() == true) {
        return false
      } else if (this.memory.creepsByType.allRound.creeps.length > 4) {
        return false
      } else if (this.memory.creepsByType.allRound.creeps.length <= 4 && this.needContainerMiner() == false) {
        return true
      } else if (this.memory.creepsByType.allRound.creeps.length <= 6 && this.level() >= 5) {
        return true
      }
    }
    // Testing to only want harvesters if we dont have miners and lorrys around
    Room.prototype.needLorry = function() {
      if (this.memory.creepsByType.containerMiner.creeps.length == 0) {
        return false
      } else if (this.memory.creepsByType.containerMiner.creeps.length != 0) {
        if (this.memory.creepsByType.lorry.creeps.length <= 2) {
          return true
        }
      }

    }

    Room.prototype.needUpgrader = function() {
      let UpgraderMemCount = this.memory.creepsByType.upgrader.creeps.length;
      if (this.level() >= 5) {
        if (UpgraderMemCount == 0 || UpgraderMemCount <= 2) {
          return true
        }
      } else if (this.level() <= 4) {
        if (UpgraderMemCount == 0 && UpgraderMemCount <= 2) {
          return true
        }
      }
    }
    Room.prototype.needContainerMiner = function() {
      let output = []
      for (var i = 0; i < Object.keys(this.memory.sourceNodes).length; i++) {
        let thisSourceID = Object.values(this.memory.sourceNodes)[i].id;
        if (Object.values(this.memory.sourceNodes)[i].container == null) {

        } else if (Object.values(this.memory.sourceNodes)[i].container != null) {
          output.push(thisSourceID)
        }
      }
      if (this.memory.creepsByType.containerMiner.creeps.length >= output.length) {
        return false
      } else if (this.memory.creepsByType.containerMiner.creeps.length < output.length) {
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
