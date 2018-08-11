require("prototype.spawn")
var config = require("config")

Room.prototype.tick = function() {
  if(this.isMine()) {
    this.processAsMine();
  } else {
    this.processAsGuest();
  }
}
Room.prototype.level = function() {
  if(this.isMine()) {
    return this.controller.level
  } else {
    return 0
  }
}
Room.prototype.isMine = function() {
  return this.controller && this.controller.my;
}

Room.prototype.processAsMine = function() {
  this.createNeeds();
}

Room.prototype.processAsGuest = function() {
  console.log("Im just a Guest here! " + this.name)
}

Room.prototype.findSource = function(room) {
  if (!room.memory.sourceNodes) {
    room.memory.sourceNodes = {};
    var sourceNodes = room.find(FIND_SOURCES);
    for (var i in sourceNodes) {
      var source = sourceNodes[i];
      source.memory = room.memory.sourceNodes[source] = {};
      source.memory.workers = 0;
    }
  } else {
    var sourceNodes = room.find(FIND_SOURCES);
    for (var i in sourceNodes) {
      var source = sourceNodes[i];
      source.memory = this.memory.sourceNodes[source];
    }
  }
}

Room.prototype.createNeeds = function(){

    if (this.needBasicWorker()) {
      this.spawnHarvester()
    }
    else if (this.needHarvester()) {
      //this.spawnHarvester()
    }
    else if (this.needContainerMiner()){
      //this.spawnContainerMiner
    }
}

Room.prototype.needBasicWorker = function() {
  //check room level and how many creeps are alive
  if (!this.memory.totalRoles) {
    this.memory.totalRoles = {};
    return true;
  }
  else {
    return
  }
}

Room.prototype.needHarvester = function() {
  let harvesters = _(Game.creeps).filter( {memory: { role: 'harvester' } } ).size();
  let creepsInRoom = _(Game.creeps).filter({room: this}).size;

  if (creepsInRoom >= 1) {
    return creepsInRoom
  }
  else {
    return;
  }
}

Room.prototype.needRepairer = function() {

    let repairer = _(Game.creeps).filter( {memory: { role: 'repairer' } } ).size();
    if (repairer <= config.maxRepairers[this.level()]) {
      return true
    } else {
      return false
    }
}

Room.prototype.needMiner = function() {
  let miner = _(Game.creeps).filter( {memory: { role: 'miner' } } ).size();
  if (miner <= config.maxMiners[this.level()]) {
    return true
  } else {
    return false
  }
}

Room.prototype.needUpgrader = function() {
  let upgrader = _(Game.creeps).filter( {memory: { role: 'upgrader' } } ).size();
  if (upgrader <= config.maxUpgrader[this.level()]) {
    return true
  } else {
    return false
  }
}

Room.prototype.needBuilder = function() {
  let builder = _(Game.creeps).filter( {memory: { role: 'builder' } } ).size();
  if (upgrader <= config.maxBuilders[this.level()]) {
    this.spawnBuilder
  }
}

Room.prototype.needDefender = function() {
  //Need being attacked logic
}

Room.prototype.needAttacker = function() {
  //attacking logic
}



Room.prototype.needContainerMiner = function(){
  for(var i in this.memory.sourceNodes){
    if(this.memory.sourceNodes[i].workers == 0){
   this.spawnMiner(i.id);
  }
    }
  }

Room.prototype.spawnHarvester = function(){}

Room.prototype.spawnMiner = function(sourceId) {
  spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS)
  console.log(spawn);
  if(spawn.energyCapacityAvailable){

    var bodyParts = spawn.roleToBuild("miner", spawn, spawn.energyCapacityAvailable)
    spawn.spawnNewCreep(bodyParts, "miner", spawn.room, sourceId)
  }

}

Room.prototype.spawnRepairer = function() {
  spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS)
  console.log(spawn);
}
Room.prototype.spawnBuilder = function() {}
Room.prototype.spawnUpgrader = function() {}
Room.prototype.spawnAttacker = function(idleFlag) {}
Room.prototype.spawnDefender = function() {}
