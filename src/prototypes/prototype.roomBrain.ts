/*require("prototype.spawn")
require("prototype.finder")
var _ = require('lodash');
var config = require("config")
*/
export class roomBrain {
  /** @function createTask
      @param {string} name  // String name of the task,     example: HARVEST
      @param {string} id  //      please do this   var id = details.target + i + Game.time .... ensure ID is unique
      @param {string} typeNeeded  // String of the Type of body needed for task,       example: ALL_ROUND
      @param {number} priority  // number of the priority of tasks assign tasks starting from one first
      @param {object} details   // further details of the task including target/s and any id's of things associated
     // create a task to assign in a queue
      */
  public static createTask(name: taskName, typeNeeded: string, priority: number, details: taskDetails): any {
    let task = {
      name: name,
      typeNeeded: typeNeeded,
      priority: priority,
      details: details
    }
    var duplicateTask = null;
    for (let i in Game.creeps) {
      if (Game.creeps[i] instanceof Creep) {
        if (duplicateTask == true) {
          break;
        } else {
          if (Game.creeps[i].spawning != true) {
            if (Game.creeps[i].memory.task != null || Game.creeps[i].memory.task != undefined) {
              if (Game.creeps[i].memory.task.details.target == task.details.target) {
                duplicateTask = true;
              }
            }
          }
        }
      }
    }
    for (var i = 0; i < this.memory.taskList.length; i++) {
      if (duplicateTask == true) {
        break;
      }
      if (this.memory.taskList[i].details.target == task.details.target) {
        duplicateTask = true;

      }
    }
    if (duplicateTask != true) {
      this.memory.taskList.push(task)
    }
  }

  Room.prototype.checkSourceForContainer = function (sourceID) {
    if (this.memory.sourceNodes[sourceID].container != null) {
      return true;
    } else {
      return false
    }
  }

  Room.prototype.sourceNodesLoop = function () {
    for (var i = 0; i < Object.keys(this.memory.sourceNodes).length; i++) {
      let thisSource = Object.values(this.memory.sourceNodes)[i]

      if (this.checkSourceForContainer(thisSource.id)) {
        var lorryDetails = {
          target: thisSource.container,
          extensions: this.memory.structureIDs.Extensions
        }
        //  console.log(thisSource.id)
        this.createTask("LORRYS", "LORRY", 2, lorryDetails);

        var thisSourceContainer = thisSource.container
        let details1 = {
          target: thisSourceContainer,
          sourceId: thisSource.id
        }
        this.createTask("CONTAINER_MINE", "CONTAINER_MINER", 1, details1);

      }
      else {
      }
      var details = {
        target: thisSource.id
      }
      this.createTask("HARVEST", "ALL_ROUND", 1, details);



      //console.log(JSON.stringify(thisSource))
    }
  }

  Room.prototype.constantTasks = function () {
    if (this.memory.structureIDs.controller.id != null) {
      let creep = Game.getObjectById(this.memory.availableCreeps[0])
      if (creep != null) {
        if (creep.memory.type == "UPGRADER") {
          details = {
            target: creep.id
          }
          this.createTask("UPGRADE", "UPGRADER", 1, details)
        }
      }
    }

    for (var s of this.find(FIND_STRUCTURES, {
      filter: function (i) {
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



  Room.prototype.processAsGuest = function () {

  }



  Room.prototype.needSourceScouts = function () {
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

  Room.prototype.needBasicWorker = function () {
    let allRoundCount = this.memory.creepsByType.allRound.creeps.length
    if (allRoundCount < 3) {
      return true
    } else if (allRoundCount <= 5 && this.level() <= 4) {
      return true;
    } else { return false; }
  }
  // Testing to only want harvesters if we dont have miners and lorrys around
  Room.prototype.needLorry = function () {
    if (Object.keys(this.findType("CONTAINER_MINER")).length == 0) {
      return false
    } else if (Object.keys(this.findType("CONTAINER_MINER")).length <= Object.keys(this.findType("LORRY")).length) {
      return false;
    }
    else {
      return true
    }

  }

  Room.prototype.needUpgrader = function () {
    let UpgraderMemCount = this.memory.creepsByType.upgrader.creeps.length;
    if (this.level() >= 5) {
      if (UpgraderMemCount == 0 || UpgraderMemCount <= 3) {
        return true
      } else {
        return false;
      }
    } else if (this.level() <= 4) {
      if (UpgraderMemCount == 0 && UpgraderMemCount <= 2) {
        return true
      } else {
        return false
      }
    }
  }
  Room.prototype.needContainerMiner = function () {
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

  Room.prototype.needDefender = function () {
    /*  if () {
        return true
      }
      else {
        return false
      }*/
  }

  Room.prototype.needRangedAttacker = function () {
    return false
    //attacking logic
  }

  Room.prototype.needBrawler = function () {

    return false
    //attacking logic
  }

  Room.prototype.needMedic = function () {
    return false
    //attacking logic
  }

  Room.prototype.needClaimer = function () {
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
}