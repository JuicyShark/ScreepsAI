require("prototype.spawn")
var config = require("config")
require("prototype.roomBrain")
require("prototype.finder")

Room.prototype.tick = function() {
  if (this.isMine()) {
    if(!this.memory) {
      this.memoryInit();
      this.assignTasks();
      this.initSource();
      this.initCreeps();
      this.createNeeds();
      this.avaliableCreeps();
    }

    if (!this.memory.timer || this.memory.timer % 60 === 0) {
      this.memory.timer = -1;
      this.memoryInit();

      this.memory.timer = 60;
      console.log(this.name + " Timer has been reset")
    }
    if (this.memory.timer % 15 == 0) {

        this.assignTasks();
    }
    if (this.memory.timer % 30 == 0) {
      this.initSource();
      this.initCreeps();
      this.createNeeds();
      //this.avaliableCreeps();
    }
    // load things needed each tick without if statement
    this.loadSource();
    this.loadConstructionSites();
    //this.avaliableCreeps();


    --this.memory.timer;
  }
// Room is not Ours
  else {
    this.processAsGuest();
  }
}


Room.prototype.avaliableCreeps = function () {
  var creepTypes = this.memory.creepsByType
  for(var i in creepTypes) {
      if(creepTypes[i].creeps.length >= 1) {
        console.log(JSON.stringify(creepTypes[i]))
      }
  }
}



Room.prototype.createNeeds = function() {
  var spawns = this.find(FIND_MY_SPAWNS)
  var spawn = spawns[0];
  if (this.needBasicWorker()) {
    spawn.spawnHarvester("n/a", "n/a")
  }else if (this.needContainerMiner()) {
      spawn.spawnContainerMiner()
    } else if (this.needLorry()) {
      let longDistance = false
      spawn.spawnLorry(longDistance) // false meaning long distance or not
    }
   else if (this.needUpgrader()) {
    spawn.spawnUpgrader()
  } else if (this.needBuilder()) {
    spawn.spawnBuilder()
  } else if (this.needRepairer()) {
    spawn.spawnRepairer()
  } else if (this.needDefender()) {
    spawn.spawnDefender()
  }

  else if (this.needSourceScouts()) {
    let theReturned = this.needSourceScouts()
    let roomName = theReturned[0]
    let flag = theReturned[1]
    spawn.spawnHarvester(roomName, flag.name)
  } else {
    console.log("Needs have been Met!")
    console.log(this.energyAvailable + "/" + this.energyCapacityAvailable + " Is the energy Capacity of the room")
  }
}


// need to start applying types to creeps based on body bodyParts
// need to create a legend of types and what tasks they are most suitable for
/*Legend can go in config file? */
Room.prototype.initCreeps = function() {
  if(!this.memory.creepsByType){
    this.memory.creepsByType = config.creepTypes

  }
  let output = [];
  for(var i in this.memory.creepsByType){
    let list = this.memory.creepsByType[i]
    let findCreeps = this.findType(list.type)
    for(var a in findCreeps) {
      var thisCreep = Game.getObjectById(findCreeps[a].id)
      if(thisCreep instanceof Creep) {
        if(thisCreep.memory.type == list.type) {
          let creepFound = false;
          for(var o in list.creeps) {
              if(thisCreep.id == list.creeps[o]){
                creepFound = true;
              }
            }
            if(creepFound == false){
              list.creeps.push(thisCreep.id)
            }
          }
    }
    }
    //console.log(list.type + " " + output)
    //list.creeps = output;

  }
}

Room.prototype.memoryInit = function() {
  if(!this.memory.taskList){
    this.memory.taskList = []
  }
  this.initStructures();
  this.initContainers();
  this.initConstructionSites();
}

Room.prototype.level = function() {
  if (this.isMine()) {
    return this.controller.level
  } else {
    return 0
  }
}

Room.prototype.safeGuardUp = function() {
  console.log("ENEMYSPOTTED!")
  this.saveLog(EnemySafeMode)
  this.controller.activateSafeMode()
}

Room.prototype.saveLog = function(type) {
  if (!this.memory.log) {
    this.memory.log = {}
    if (type == "EnemySafeMode") {
      let gameTime = Game.time
      this.memory.log.gameTime = Config.defaultLogs.EnemyInRoom + Config.defaultLogs.SafeModeActivate;
    }
  }
}

Room.prototype.initSource = function() {
  if (!this.memory.sourceNodes) {
    this.memory.sourceNodes = {}
  }
  for (let source of this.find(FIND_SOURCES)) {
    if (!this.memory.sourceNodes[source.id]) {
      this.memory.sourceNodes[source.id] = {
        id: source.id
      }
    }
    this.memory.sourceNodes[source.id].miner = "waiting"
    this.memory.hostileSpawns = this.find(STRUCTURE_KEEPER_LAIR);
    let miners = this.roomMiners()

    //console.log("MINERS" + miners)
    //miners[i].memory.task[0].details.sourceId == source.id
    for(i in miners) {
      if(miners[i].memory.task[0]) {
        if(miners[i].memory.task[0].details.sourceId == source.id) {

        this.memory.sourceNodes[source.id].miner = miners[i].id;
        }
      } else if(!miners[i].memory.task[0]) {

        }
    }
    if (!this.memory.sourceNodes[source.id].miner) {
      this.memory.sourceNodes[source.id].miner = "waiting"
    }
    if (!this.memory.sourceNodes[source.id].toBuild) {
      this.memory.sourceNodes[source.id].toBuild = config.buildingLevels.sources;
    }
    if (!this.memory.sourceNodes[source.id].container) {

      let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
       filter: (s) => s.structureType === STRUCTURE_CONTAINER
      });
        if(containers.length == 0) {
          this.memory.sourceNodes[source.id].container = ""
        } else {
        this.memory.sourceNodes[source.id].container = containers[0].id;
      }
    }
  }

}

Room.prototype.loadSource = function() {
  this.sourceNodes = {};
  for (let id in this.memory.sourceNodes) {

    this.sourceNodes[id] = Game.getObjectById(id)
  }
  this.hostileSpawns = [];
  for (let i in this.memory.hostileSpawns) {
    this.hostileSpawns[i] = Game.getObjectById(i.id)
  }
}

Room.prototype.initStructures = function() {


//  console.log(Object.values(extension))

  if (!this.memory.structureIDs) {

    this.memory.structureIDs = config.defaultMem.RoomStructureMem;
    this.structures = this.find(FIND_MY_STRUCTURES);
    this.memory.structureIDs = config.defaultMem.RoomStructureMem;
    let mem = this.memory.structureIDs;
    for (let i in this.structures) {
      if(this.structures[i].structureType == "tower"){
        mem.Towers.push(this.structures[i].id)
      }
      if(this.structures[i].structureType == "spawn"){
        mem.Spawns.push(this.structures[i].id)
      }
      if(this.structures[i].structureType == "extension"){
        mem.Extensions.push(this.structures[i].id)
      }
    }
/*

    this.memory.structureIDs = config.defaultMem.RoomStructureMem;
    let mem = this.memory.structureIDs;
    mem.controller.id = this.controller.id;
    mem.Extensions =
    mem.Towers */
  }
}

Room.prototype.initContainers = function() {
  var containers = this.find(FIND_STRUCTURES, {
    filter: {
      structureType: STRUCTURE_CONTAINER
    }
  });
  if (containers) {
    for (let i in containers) {
      if (containers[i] instanceof StructureContainer) {
        this.memory.structureIDs.Containers[i] = containers[i].id
      } else {
        console.log('Container is not instanceof SturctureContainer')
        containers.splice(i);
      }
    }
  }
}

Room.prototype.initConstructionSites = function() {
  this.memory.constructionSites = [];
  this.constructionSites = this.find(FIND_CONSTRUCTION_SITES)
  for (let i in this.constructionSites) {
    this.memory.constructionSites[i] = this.constructionSites[i].id
    this.initConstructionTasks(this.constructionSites[i].id )
  }
};

Room.prototype.initConstructionTasks = function(constructionSite){
  details = {target: constructionSite};

  this.createTask("BUILD", "ALL_ROUND", 3, details)
}
Room.prototype.loadConstructionSites = function() {
  this.constructionSites = [];
  for (let i in this.memory.constructionSites) {
    this.constructionSites[i] = (Game.getObjectById(this.memory.constructionSites[i]));
  }
};




/** @function ConvertsToLocation
    @param {string} RoomName
    @return {X:"", Y:""}*/
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
