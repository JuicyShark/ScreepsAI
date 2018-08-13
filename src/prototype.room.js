require("prototype.spawn")
var config = require("config")

Room.prototype.tick = function() {
  if (this.isMine()) {
    this.initCreeps();
    if (!this.memory.timer || this.memory.timer % 60 === 0) {
      this.memory.timer = -1;
    this.memoryInit()
      this.memory.timer = 60;
      console.log(this.name + " Timer has been reset")
    }
    // load things needed each tick without if statement
    this.loadSource();
    this.loadConstructionSites();

    if (this.memory.timer % 15 == 0) {
      this.createNeeds();
      if(this.constructionSites.length != 0){
        console.log("looking for builder")
        this.findBuilder(this.constructionSites[0]);

      }
    }
    -- this.memory.timer;
  }

  else {
    this.processAsGuest();
  }
}

Room.prototype.initCreeps = function(){
  this.creepsAllRound = this.find(FIND_MY_CREEPS, {filter: {memory: {type: "ALL_ROUND"}}});
}

Room.prototype.memoryInit = function() {
    this.initSource();
    this.initTotalRoles();
    this.initStructures();
    this.initConstructionSites();

}

Room.prototype.level = function() {
  if (this.isMine()) {
    return this.controller.level
  } else {
    return 0
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
    return 2;
  }
}

Room.prototype.processAsGuest = function() {
  console.log("Im just a Guest here! " + this.name)
}

Room.prototype.initTotalRoles = function(){
  if (!this.memory.totalRoles) {
    this.memory.totalRoles = {};
  }
  // Find amount of different roles alive currently
  for (var i in config.roleList) {
    this.memory.totalRoles[i] = _.sum(Game.creeps, (c) => c.memory.role == i);
  }
}


Room.prototype.initSource = function() {
  if(!this.memory.sourceNodes) {
    this.memory.sourceNodes = {}
}
  for (let source of this.find(FIND_SOURCES)) {
    if(!this.memory.sourceNodes[source.id]){
      this.memory.sourceNodes[source.id] = {id: source.id}
    }
    this.memory.hostileSpawns = this.find(STRUCTURE_KEEPER_LAIR);
    let miners = this.find(FIND_MY_CREEPS, {filter: {memory: {sourceId: source.id}}});
    this.memory.sourceNodes[source.id].miners = miners.length
  }
}

Room.prototype.loadSource = function() {
  this.sourceNodes = {};
  for(let id in this.memory.sourceNodes){

    this.sourceNodes[id] = Game.getObjectById(id)
  }

  this.hostileSpawns = [];
  for(let i in this.memory.hostileSpawns){
    this.hostileSpawns[i] = Game.getObjectById(i.id)
  }
}

Room.prototype.initStructures = function() {
  if(!this.memory.structures){
    this.memory.structures = {}
  }else{
  this.initContainers();
}
}

Room.prototype.initContainers = function() {
  if(!this.memory.structures.containerIds){
    this.memory.structures.containerIds = [];
  }
  var containers = this.find(FIND_STRUCTURES, {
    filter: {
      structureType: STRUCTURE_CONTAINER
    }
  });
  for (let i in this.containers) {
    if (containers[i] instanceof StructureContainer) {
      this.memory.structures.containerIds[i] = containers[i].id
    } else {
      console.log('Container is not instanceof SturctureContainer')
      containers.splice(i);
    }
  }
}


Room.prototype.initConstructionSites = function(){
  this.memory.constructionSites = [];
  this.constructionSites = this.find(FIND_CONSTRUCTION_SITES)
  for(let i in this.constructionSites){
    this.memory.constructionSites[i] = this.constructionSites[i].id
  }
};

Room.prototype.loadConstructionSites = function(){
  this.constructionSites = [];
  for(let i in this.memory.constructionSites){
    this.constructionSites[i] = (Game.getObjectById(this.memory.constructionSites[i]));
  }
};


Room.prototype.findBuilder = function(constructionSite){
  for(let i in this.creepsAllRound){
   var potentialCreep = this.creepsAllRound[i]
   console.log(potentialCreep)
    if(!potentialCreep.memory.target){

      console.log("test " + constructionSite.id)
      potentialCreep.memory.target = constructionSite.pos
      console.log(potentialCreep.memory.target)

      break;
    }
  }
}

Room.prototype.createNeeds = function() {

  if (this.needBasicWorker()) {
    this.spawnHarvester()
  } else if (this.needHarvester()) {
    this.spawnHarvester()
  } else if (this.needContainerMiner()) {
    for (var i in this.memory.sourceNodes) {
      if (this.memory.sourceNodes[i].miners == 0) {
        this.spawnContainerMiner(this.memory.sourceNodes[i].id)
      }
    }
  } else if (this.needLorry()) {
    this.spawnLorry()
  } else if (this.needUpgrader()) {
    this.spawnUpgrader()
  } else if (this.needBuilder()) {
    this.spawnBuilder()
  } else if (this.needRepairer()) {
    this.spawnRepairer()
  } else if (this.needDefender()) {
    this.spawnDefender()
  }
  /*  else if (this.needA) {

    }*/
  else {
    console.log("Needs have been Met!")
  }
}

Room.prototype.needBasicWorker = function() {
  let harvesters = this.memory.totalRoles.harvester;
  if (harvesters == null || harvesters == 0) {
    return true;
  } else if (harvesters >= 1) {
    return false
  }
}

// Testing to only want harvesters if we dont have miners and lorrys around
Room.prototype.needHarvester = function() {
  let harvesters = this.memory.totalRoles.harvester;
  let miners = this.memory.totalRoles.miner;
  if (harvesters == 0 && miners == 0) {
    return true
  } else {
    false
  }
}


Room.prototype.needLorry = function() {
  let lorrys = this.memory.totalRoles.lorry;
  let miners = this.memory.totalRoles.miner;
  if (lorrys <= 1 && miners >= 1 ) {
    return true
  }
}


Room.prototype.needRepairer = function() {
  let repairer = _(Game.creeps).filter({
    memory: {
      role: 'repairer'
    }
  }).size();
  if (repairer <= config.maxRepairers[this.level()]) {
    return true
  }
}

Room.prototype.needUpgrader = function() {
  let upgrader = _(Game.creeps).filter({
    memory: {
      role: 'upgrader'
    }
  }).size();
  if (upgrader <= config.maxUpgraders[this.level()]) {
    return true
  }
}

Room.prototype.needBuilder = function() {
  let builder = _(Game.creeps).filter({
    memory: {
      role: 'builder'
    }
  }).size();
  if (builder <= config.maxBuilders[this.level()]) {
    return true;
  }
}

Room.prototype.needContainerMiner = function() {
  for (var i in this.memory.sourceNodes) {

    if (this.memory.sourceNodes[i].miners == 1) {
      return false
    } else if (this.memory.sourceNodes[i].miners == 0 && this.memory.structures.containerIds.length >= 1) {
      return true
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

Room.prototype.spawnHarvester = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.default
    spawn.spawnNewCreep(bodyParts, "harvester", spawn.room)
  }
}

Room.prototype.spawnContainerMiner = function(sourceId) {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.miner[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "miner", spawn.room, sourceId)
  }
}

Room.prototype.spawnLorry = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.lorry[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "lorry", spawn.room)
  }
}

Room.prototype.spawnRepairer = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.repairer[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "repairer", spawn.room)
  }
}
Room.prototype.spawnBuilder = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.builder[spawn.energyCapacity]
    var type = "ALL_ROUND"
    spawn.spawnNewCreep(bodyParts, "builder", spawn.room, "" ,type )
  }
}
Room.prototype.spawnUpgrader = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.upgrader[spawn.energyCapacity]
    spawn.spawnNewCreep(bodyParts, "upgrader", spawn.room)
  }
}
Room.prototype.spawnAttacker = function(idleFlag) {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.attacker[spawn.energyCapacity]
    spawn.spawnAttackCreep(bodyParts, "attacker", spawn.room)
  }
}
Room.prototype.spawnDefender = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.defender(spawn.energyCapacity)
    spawn.spawnDefenseCreep(bodyParts, "defender", spawn.room)
  }
}
Room.prototype.canSpawn = function() {
  if (this.isMine()) {
    spawn = this.find(FIND_MY_SPAWNS)
    return spawn[0]
  }
}
