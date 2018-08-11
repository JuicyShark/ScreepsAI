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
  if (!(this.memoryInit())) {
    this.memoryInit()
  }
  this.createNeeds();
}

Room.prototype.processAsGuest = function() {
  console.log("Im just a Guest here! " + this.name)
}

Room.prototype.memoryInit = function() {
  //console.log("here in Init")
}

Room.prototype.findSource = function(room) {
  if (!room.memory.sourceNodes) {
    room.memory.sourceNodes = {};
    var sourceNodes = room.find(FIND_SOURCES);
    for (var i in sourceNodes) {
      var source = sourceNodes[i];
      source.memory = room.memory.sourceNodes[source] = {};
      source.memory.miners = 0;
    }
  } else {
    var sourceNodes = room.find(FIND_SOURCES);
    for (var i in sourceNodes) {
      var source = sourceNodes[i];
      source.memory = this.memory.sourceNodes[source.id];
      let miner = source.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: { memory: { role: 'miner'}
        }
      })
      source.memory.miners = miner.length;
    }
  }
}

Room.prototype.createNeeds = function(){

    if (this.needBasicWorker()) {
      console.log("1")
      this.spawnHarvester()
    }
    else if (this.needHarvester()) {
      console.log("2")
      this.spawnHarvester()
    }
    else if (this.needContainerMiner()){
      console.log("3")
      this.spawnMiner(this.needContainerMiner())
    }
    else if (this.needLorry()){
      console.log("3.5")
      this.spawnLorry()
    }
    else if (this.needUpgrader()) {
      console.log("4")
      this.spawnUpgrader()
    }
    else if (this.needBuilder()) {
      console.log("5")
      this.spawnBuilder()
    }
    else if (this.needRepairer()){
      console.log("6")
      this.spawnRepairer()
    }
    else { console.log("Needs Met!")}
}

Room.prototype.needBasicWorker = function() {
  //check room level and how many creeps are alive
  //need to check for body parts of all creeps in room for any work and if they are harvesting
  if (!this.memory.totalRoles) {
    this.memory.totalRoles = {};
    return true;
  }
  if (this.memory.totalRoles.harvester == null) {
    return true;
  }
  else {
    return false
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

Room.prototype.needLorry = function() {
  let lorrys = _(Game.creeps).filter( {memory: {role: 'lorry'}}).size()

  if (lorrys <= config.maxLorrys[this.level()]) {
    return true
  }
  else {
    return false
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
  if (upgrader <= config.maxUpgraders[this.level()]) {
    return true
  } else {
    return false
  }
}

Room.prototype.needBuilder = function() {
  let builder = _(Game.creeps).filter( {memory: { role: 'builder' } } ).size();
  if (builder <= config.maxBuilders[this.level()]) {
    return true;
  }
  else {
    return false;
  }
}

Room.prototype.needDefender = function() {
  return false
  //Need being attacked logic
}

Room.prototype.needAttacker = function() {
  return false
  //attacking logic
}



Room.prototype.needContainerMiner = function(){
  for(var i in this.memory.sourceNodes){
    if(this.memory.sourceNodes[i].miners == 0){
        return i.id
        }
      else {
        return false
      }
    }
  }

Room.prototype.spawnHarvester = function(){
  if(this.canSpawn() != false){
    spawn = this.canSpawn();
    var bodyParts = config.bodies.default
    spawn.spawnNewCreep(bodyParts, "harvester", spawn.room)
  }
}

Room.prototype.spawnMiner = function(sourceId) {
  if(this.canSpawn() != false){
    spawn = this.canSpawn();
    var bodyParts = config.bodies.miner[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "miner", spawn.room, sourceId)
  }
}

Room.prototype.spawnLorry = function() {
  if(this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.lorry[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "lorry", spawn.room)
  }
}

Room.prototype.spawnRepairer = function() {
  if(this.canSpawn() != false){
    spawn = this.canSpawn();
    var bodyParts = config.bodies.repairer[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "repairer", spawn.room)
  }
}
Room.prototype.spawnBuilder = function() {
  if(this.canSpawn() != false){
    spawn = this.canSpawn();
    var bodyParts = config.bodies.builder[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "builder", spawn.room)
  }
}
Room.prototype.spawnUpgrader = function() {
  if(this.canSpawn() != false){
    spawn = this.canSpawn();
    var bodyParts = config.bodies.builder[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "builder", spawn.room)
  }
}
Room.prototype.spawnAttacker = function(idleFlag) {
  if(this.canSpawn() != false){
    spawn = this.canSpawn();
    var bodyParts = config.bodies.attacker[spawn.energyCapacity]
    spawn.spawnAttackCreep(bodyParts, "attacker", spawn.room, idleFlag)
  }
}
Room.prototype.spawnDefender = function(idleFlag) {
  if(this.canSpawn() != false){
    spawn = this.canSpawn();
    var bodyParts = config.bodies.defender[spawn.energyCapacity]
    spawn.spawnDefenseCreep(bodyParts, "defender", spawn.room, idleFlag)
  }
}
Room.prototype.canSpawn = function() {
  if(this.isMine()) {
    spawn = this.find(FIND_MY_SPAWNS)
    return spawn[0]
  } else {
    return false
  }
}
