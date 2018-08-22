require("prototype.spawn")
var config = require("config")
require("prototype.roomBrain")
require("prototype.finder")

Room.prototype.tick = function() {

  if (this.isMine()) {
    if(!this.memory) {
      this.memoryInit();
      this.assignTasks();
      this.initCreeps();
      this.initSource();
      this.createNeeds();
      this.contantTasks();
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
      this.initCreeps();
      this.initSource();
      this.createNeeds();
      this.constantTasks();
    }
    // load things needed each tick without if statement
    this.loadSource();
    this.loadConstructionSites();


    --this.memory.timer;
  }
// Room is not Ours
  else {
    this.processAsGuest();
  }
}
Room.prototype.createNeeds = function() {
  var spawns = this.find(FIND_MY_SPAWNS)
  var spawn = spawns[0];
  if (this.needBasicWorker()) {
    if(this.findType("ALL_ROUND").length == 0){
      spawn.spawnBasicAllRounder()
    }else{
    spawn.spawnAllRounder()}
  } else if (this.needUpgrader()) {
   spawn.spawnUpgrader()
 } else if (this.needLorry()) {
   spawn.spawnLorry()
 } else if (this.needContainerMiner()) {
      spawn.spawnContainerMiner()
    }/*
  else if (this.needSourceScouts()) {
    let theReturned = this.needSourceScouts()
    let roomName = theReturned[0]
    let flag = theReturned[1]
    spawn.spawnHarvester(roomName, flag.name)
  }*/ else {
    console.log("Needs have been Met!")
    console.log(this.energyAvailable + "/" + this.energyCapacityAvailable + " Is the energy Capacity of the room")
  }
}


// need to start applying types to creeps based on body bodyParts
// need to create a legend of types and what tasks they are most suitable for
/*Legend can go in config file? */
Room.prototype.initCreeps = function() {
  if(!this.memory.creepsByType){
    this.memory.creepsByType = config.defaultMem.creepTypes
  }
  let output = [];

  for(var i in this.memory.creepsByType){
    let list = this.memory.creepsByType[i]
    list.creeps = []
    let findCreeps = this.findType(list.type)
    for(var a in findCreeps) {
      var thisCreep = Game.getObjectById(findCreeps[a].id)
      if(thisCreep instanceof Creep) {
        if(thisCreep.memory.type == list.type) {
              list.creeps.push(thisCreep.id)

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
        id: source.id,
      }
    }
    this.memory.hostileSpawns = this.find(STRUCTURE_KEEPER_LAIR);
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
      if(this.structures[i].structureType == STRUCTURE_ROAD) {
        mem.Roads.push(this.structures[i].id)
      }

    }
    mem.controller.id = this.controller.id;
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
    this.initConstructionTasks(this.constructionSites[i] )
  }
};

Room.prototype.initConstructionTasks = function(constructionSite){
  let siteType = constructionSite.structureType

  let priorityList = Object.entries(config.taskPriorities.constructionSites)
  for(let i = 0;i < priorityList.length; i++){
    let sortingType = priorityList[i]
    if (siteType == sortingType[0]){
      let selectedPriority = sortingType[1];
      details = {target: constructionSite.id};
      this.createTask("BUILD", "ALL_ROUND", selectedPriority, details)
    }
  }

}
Room.prototype.loadConstructionSites = function() {
  this.constructionSites = [];
  for (let i in this.memory.constructionSites) {
    this.constructionSites[i] = (Game.getObjectById(this.memory.constructionSites[i]));
  }
};
