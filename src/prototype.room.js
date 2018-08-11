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
    console.log(repairer)
    console.log(config.maxRepairers[2])
    if (repairer <= config.maxRepairers[this.level()]) {
      this.spawnRepairer
    }
}

Room.prototype.needMiner = function() {

}

Room.prototype.needUpgrader = function() {

}

Room.prototype.needDefender = function() {

}

Room.prototype.needAttacker = function() {

}



Room.prototype.needContainerMiner = function(){
  for(var i in this.memory.sourceNodes){
    if(this.memory.sourceNodes[i].workers == 0){
   this.spawnMiner(i.id);
  }
    }
  }

Room.prototype.spawnBasicWorker = function(){}

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
