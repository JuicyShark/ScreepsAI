require("prototype.spawn")
var config = require("config")

Room.prototype.tick = function() {
  /*this.OutpostCheck()
  console.log("Yep")
  */
  if (this.isMine()) {
    this.initCreeps();
    if (!this.memory.timer || this.memory.timer % 60 === 0) {
      this.memory.timer = -1;
      this.memoryInit();

      this.memory.timer = 60;
      console.log(this.name + " Timer has been reset")
    }
    // load things needed each tick without if statement
    this.loadSource();
    this.loadConstructionSites();

    if (this.memory.timer % 30 == 0) {
      this.initSource();
      this.createNeeds();
      if (this.constructionSites.length != 0) {
        this.findBuilder(this.constructionSites[0]);
      }
    }
    --this.memory.timer;
  }
// Room is not Ours
  else {
    this.processAsGuest();
  }
}
// need to start applying types to creeps based on body bodyParts
// need to create a legend of types and what tasks they are most suitable for
Room.prototype.initCreeps = function() {
  this.creepsAllRound = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        type: "ALL_ROUND"
      }
    }
  });
}

Room.prototype.memoryInit = function() {
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
    this.safeGuardUp()
    return 2;
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

Room.prototype.processAsGuest = function() {
  console.log("Im just a Guest here! " + this.name)
  let roomFlags = this.find(FIND_FLAGS, {
    filter: {
      name: "HarvestSources"
    }
  });
  if (roomFlags != undefined) {
    console.log("FLAG!")
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
    this.memory.hostileSpawns = this.find(STRUCTURE_KEEPER_LAIR);
    let miners = this.find(FIND_MY_CREEPS, {
      filter: {
        memory: {
          sourceId: source.id
        }
      }
    });
    this.memory.sourceNodes[source.id].miners = miners.length
    if (!this.memory.sourceNodes[source.id].toBuild) {
      this.memory.sourceNodes[source.id].toBuild = config.buildingLevels.sources;
    }
    if (!this.memory.sourceNodes[source.id].container) {
      this.memory.sourceNodes[source.id].container = "";
    }
  }
  this.initContainers();
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
  if (!this.memory.structureIDs) {
    this.memory.structureIDs = config.DefaultMem.RoomStructureMem;
  }
}

Room.prototype.initContainers = function() {
  var containers = this.find(FIND_STRUCTURES, {
    filter: {
      structureType: STRUCTURE_CONTAINER
    }
  });
  if (containers) {
    let temp1 = [];
    for (let i in containers) {
      if (containers[i] instanceof StructureContainer) {
        let source = containers[i].pos.findInRange(FIND_SOURCES, 1);
        if (source.length == 0) {
          temp1.push(containers[i].id)
        } else if (source.length == 1) {
          this.memory.sourceNodes[source[0].id].container = containers[i].id
          this.memory.sourceNodes[source[0].id].toBuild.Container = false;
        }
      } else {
        console.log('Container is not instanceof SturctureContainer')
        containers.splice(i);
      }
    }
    /*  if(this.memory.structureIDs.Containers != temp1) {
        this.memory.structureIDs.Containers = temp1;
      }*/
  }
}

Room.prototype.initConstructionSites = function() {
  this.memory.constructionSites = [];
  this.constructionSites = this.find(FIND_CONSTRUCTION_SITES)
  for (let i in this.constructionSites) {
    this.memory.constructionSites[i] = this.constructionSites[i].id
  }
};

Room.prototype.loadConstructionSites = function() {
  this.constructionSites = [];
  for (let i in this.memory.constructionSites) {
    this.constructionSites[i] = (Game.getObjectById(this.memory.constructionSites[i]));
  }
};


Room.prototype.findBuilder = function(constructionSite) {
  for (let i in this.creepsAllRound) {
    var potentialCreep = this.creepsAllRound[i]

    if (!potentialCreep.memory.target) {
      potentialCreep.memory.target = constructionSite.id
      break;
    }
  }
}

Room.prototype.createNeeds = function() {
  if (this.needBasicWorker()) {
    this.spawnHarvester("n/a", "n/a")
  } else if (this.needLorry()) {
    let longDistance = false
    this.spawnLorry(longDistance) // false meaning long distance or not
  } else if (this.needContainerMiner()) {
    for (var i in this.memory.sourceNodes) {
      if (this.memory.sourceNodes[i].miners == 0) {
        this.spawnContainerMiner(this.memory.sourceNodes[i].id)
      }
    }
  } else if (this.needUpgrader()) {
    this.spawnUpgrader()
  } else if (this.needBuilder()) {
    this.spawnBuilder()
  } else if (this.needRepairer()) {
    this.spawnRepairer()
  } else if (this.needDefender()) {
    this.spawnDefender()
  }
  /*else if (this.needClaimer()){
  }*/
  /*  else if (this.needA) {
    }*/
  else if (this.needSourceScouts()) {
    let theReturned = this.needSourceScouts()
    let roomName = theReturned[0]
    let flag = theReturned[1]
    this.spawnHarvester(roomName, flag.name)
  } else {
    console.log("Needs have been Met!")
    console.log(this.energyAvailable + "/" + this.energyCapacityAvailable + " Is the energy Capacity of the room")
  }
}

Room.prototype.needSourceScouts = function() {
  let scoutRoomFlags = [];
  for (i in Memory.flags) {
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
  let harvesters = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "harvester"
      }
    }
  });
  let miners = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "miner"
      }
    }
  });
  let lorrys = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "lorry"
      }
    }
  });
  if (miners.length >= 2 && lorrys.length >= 2) {
    return false;
  } else if (harvesters.length == null || harvesters == 0) {
    console.log("need worker")
    return true;
  } else if (this.needContainerMiner()) {
    return false;
  }

}
// Testing to only want harvesters if we dont have miners and lorrys around
Room.prototype.needLorry = function() {
  let lorrys = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "lorry"
      }
    }
  });
  let miners = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "miner"
      }
    }
  });
  if (miners.length >= 1 && lorrys.length < config.maxLorrys[this.level()]) {
    return true
  } else if (lorrys.length > config.maxLorrys[this.level()]) {
    return false;
  }
}

Room.prototype.needRepairer = function() {
  let repairer = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "repairer"
      }
    }
  });
  if (repairer.length <= config.maxRepairers[this.level()]) {
    return true
  }
}

Room.prototype.needUpgrader = function() {
  let upgrader = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "upgrader"
      }
    }
  });
  if (upgrader.length <= config.maxUpgraders[this.level()]) {
    return true
  }
}

Room.prototype.needBuilder = function() {
  let builder = this.find(FIND_MY_CREEPS, {
    filter: {
      memory: {
        role: "builder"
      }
    }
  });
  if (builder.length <= config.maxBuilders[this.level()]) {
    return true;
  }
}

Room.prototype.needContainerMiner = function() {
  for (var i in this.memory.sourceNodes) {
    if (this.memory.sourceNodes[i].miners == 0 && this.memory.sourceNodes[i].container != "") {
      return true
    }
    if (this.memory.sourceNodes[i].miners == 1) {
      return false
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

Room.prototype.needClaimer = function() {
  if (this.energyCapacityAvailable >= 700) {
    for (let i in Memory.flags) {
      let = thisFlag = Memory.flags[i]
      if (thisFlag.name == "ClaimRoom" && thisFlag.hasClaimer == false) {
        this.spawnClaimer(roomName, thisFlag)
      }
    }
    return true;
  } else {
    return false;
  }
}

Room.prototype.spawnReserver = function(roomName, flag) {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.claimer
    spawn.spawnNewCreep(bodyParts, "claimer", spawn.room, "n/a", roomName, flag)

  }

}

Room.prototype.spawnClaimer = function(roomName, thisFlag) {
  if (this.canSpawn() != false) {

    if (thisFlag == null || thisFlag == "n/a") {
      thisFlag = "n/a"
    }
    spawn = this.canSpawn();
    var bodyParts = config.bodies.claimer
    spawn.spawnNewCreep(bodyParts, "claimer", spawn.room, "n/a", roomName, thisFlag)
    thisFlag.hasClaimer = true;
  }

}

Room.prototype.spawnHarvester = function(roomName, flagName) {
    spawn = this.canSpawn();
    console.log("trying to spawn basic " + spawn )
  if (spawn != null) {
    if (roomName == "n/a") {
      var bodyParts = config.bodies.default
    } else {
      let myConfig = config.bodies.harvester;
      var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.energyCapacityAvailable)]
    }
    spawn.spawnNewCreep(bodyParts, "harvester", spawn.room, "n/a", roomName, flagName)
  }
}

Room.prototype.spawnContainerMiner = function(sourceId) {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    let myConfig = config.bodies.miner;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.energyCapacityAvailable)]
    spawn.spawnNewCreep(bodyParts, "miner", spawn.room, sourceId)
  }
}

Room.prototype.spawnLorry = function(longDistance) {
  if (longDistance == false) {
    if (this.canSpawn() != false) {
      spawn = this.canSpawn();
      let myConfig = config.bodies.lorry;
      var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.energyCapacityAvailable)]
      spawn.spawnNewCreep(bodyParts, "lorry", spawn.room)
    }
  }
}

Room.prototype.spawnRepairer = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    let myConfig = config.bodies.repairer;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.energyCapacityAvailable)]
    spawn.spawnNewCreep(bodyParts, "repairer", spawn.room)
  }
}

Room.prototype.spawnBuilder = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    let myConfig = config.bodies.builder;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.energyCapacityAvailable)]
    var type = "ALL_ROUND"
    spawn.spawnNewCreep(bodyParts, "builder", spawn.room, "", type)
  }
}

Room.prototype.spawnUpgrader = function() {
  if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    let myConfig = config.bodies.upgrader;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.energyCapacityAvailable)]
    spawn.spawnNewCreep(bodyParts, "upgrader", spawn.room)
  }
}

Room.prototype.spawnAttacker = function(idleFlag) {
  /*if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.attacker[this.energyCapacityAvailable]
    spawn.spawnAttackCreep(bodyParts, "attacker", spawn.room)
  }*/
}
Room.
prototype.spawnDefender = function() {
  /*  if (this.canSpawn() != false) {
      spawn = this.canSpawn();
      var bodyParts = config.bodies.defender(this.energyCapacityAvailable)
      spawn.spawnDefenseCreep(bodyParts, "defender", spawn.room)
    }*/
}

Room.prototype.canSpawn = function() {
  if (this.isMine()) {
    spawn = this.find(FIND_MY_SPAWNS)
    let temp1 = spawn[0];
    return temp1;
  }
}

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
