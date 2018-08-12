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
  //this.canSpawn().findRoleNeeded(this)
  this.createNeeds();
}

Room.prototype.processAsGuest = function() {
  console.log("Im just a Guest here! " + this.name)
}

Room.prototype.memoryInit = function() {
  //console.log("here in Init")
  if(!this.memory.totalRoles){
    this.memory.totalRoles = config.roleList
  }
  for(var i in this.memory.totalRoles) {
    this.memory.totalRoles[i] = _.sum(Game.creeps, (c) => c.memory.role == i);
  }
    if (!this.memory.sourceNodes) {
      this.memory.sourceNodes = {};
    }
  this.findSource(this)
}

Room.prototype.findSource = function(room) {
    var sourceNodes = room.find(FIND_SOURCES);
    for (var i in sourceNodes) {
      var miners = 0
      var source = sourceNodes[i];
      for(var i in Game.creeps, (c) => c.memory.role == "miner"){
        if(source == i.sourceId){
          miners++
          console.log(i.name + " Is Working At " + source);
        }
      }
      source.memory = this.memory.sourceNodes[source];
      source.memory.miners = miners;
    }
  }


Room.prototype.createNeeds = function(){

    if (this.needBasicWorker()) {
      this.spawnHarvester()
    }
    else if (this.needHarvester()){
      this.spawnHarvester()
    }
    else if (this.needContainerMiner() != false){
      this.spawnContainerMiner(this.needContainerMiner())
    }
    else if (this.needLorry()){
      this.spawnLorry()
    }
    else if (this.needUpgrader()) {
      this.spawnUpgrader()
    }
    else if (this.needBuilder()) {
      this.spawnBuilder()
    }
    else if (this.needRepairer()){
      this.spawnRepairer()
    }
    else { console.log("Needs Met!")}
}

Room.prototype.needBasicWorker = function() {
  //check room level and how many creeps are alive
  //need to check for body parts of all creeps in room for any work and if they are harvesting
  if (this.memory.totalRoles.harvester == null) {
    return true;
  }
  else {
    return false
  }
}

  // Testing to only want harvesters if we dont have miners and lorrys around
Room.prototype.needHarvester = function() {
  let harvesters = _(Game.creeps).filter( {memory: { role: 'harvester' } } ).size;
  let creepsInRoom = _(Game.creeps).filter({room: this}).size;
  if (this.memory.totalRoles.harvester == 0 && this.memory.totalRoles.miner == 0) {
    return true
  }
   else {
     if(this.memory.totalRoles.miner > 0 && this.memory.totalRoles.lorry == 0){
       this.spawnLorry()
       return false
     }
     else if(this.memory.totalRoles.miner > 0 && this.memory.totalRoles.lorry > 0){
       return false
     }else{
       return true
     }
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

Room.prototype.spawnContainerMiner = function(sourceId) {
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
    var bodyParts = config.bodies.upgrader[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "upgrader", spawn.room)
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
