require("prototype.spawn")
var config = require("config")

Room.prototype.tick = function() {
  if (this.isMine()) {
    if (Game.time % 14 === 0) {
      console.log(this.name + " tick! " + Game.time)
    this.processAsMine();
    }
  } else {
    this.processAsGuest();
  }
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

Room.prototype.processAsMine = function() {
  //This is where I am going to call things from! :D
  this.memoryInit()
  this.createNeeds();
}

Room.prototype.processAsGuest = function() {
  console.log("Im just a Guest here! " + this.name)
}

Room.prototype.memoryInit = function() {
  if (!this.memory.totalRoles) {
    this.memory.totalRoles = {};
  }
  // Find amount of different roles alive currently
  for (var i in config.roleList) {
    this.memory.totalRoles[i] = _.sum(Game.creeps, (c) => c.memory.role == i);
  }

  if (!this.memory.sourceNodes) {
    this.memory.sourceNodes = {};
  }
  this.findSource()

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

Room.prototype.findSource = function() {
  let sources = [];
  var sourceNode = this.find(FIND_SOURCES);
  for (var i in sourceNode) {
    var miners = 0
    var source = sourceNode[i];

    for (var i in Game.creeps) {
      if (source.id == Game.creeps[i].memory.sourceId) {
        miners++
      }
    }
    source.miners = miners;
    sources.push(source)
  }
  this.memory.sourceNodes = sources;
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
  let lorrys = _(Game.creeps).filter({
    memory: {
      role: 'lorry'
    }
  }).size()
  if (lorrys <= config.maxLorrys[this.level()]) {
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
    } else if (this.memory.sourceNodes[i].miners == 0) {
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
    spawn.spawnNewCreep(bodyParts, "builder", spawn.room)
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
