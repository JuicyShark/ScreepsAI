require('prototype.creepBuilder'),
require('nameGen')
var config = require("config")

StructureSpawn.prototype.spawnNewCreep = function(bodyParts, role, home) {

  var name = this.nameGen();
  var testCreep = this.spawnCreep(bodyParts, name, {
    dryRun: true
  });
  if (testCreep == 0) {
    this.spawnCreep(bodyParts, name, {
      memory: {
        role: role,
        working: "false",
        home: home.name
      }
    });
    console.log("Spawning a " + role + ", named " + name);
  } else if (this.spawning){
    console.log("Spawning " + role);
  } else {
    if (Game.time % 5 === 0) {
    console.log("Spawn waiting with " + role)
  }
  }
};

Spawn.prototype.spawnReserver = function(roomName, flag) {
    var bodyParts = config.bodies.claimer
    this.spawnNewCreep(bodyParts, "claimer", this.room.name)

  }



Spawn.prototype.spawnClaimer = function(roomName, thisFlag) {
    var bodyParts = config.bodies.claimer
    this.spawnNewCreep(bodyParts, "claimer", this.room.name)
    //thisFlag.hasClaimer = true;
  }



Spawn.prototype.spawnHarvester = function(roomName, flagName) {


    if (roomName == "n/a") {
      var bodyParts = config.bodies.default
    } else {
      let myConfig = config.bodies.harvester;
      var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
    }
    this.spawnNewCreep(bodyParts, "harvester", this.room.name, "n/a", roomName, flagName)
}

Spawn.prototype.spawnContainerMiner = function(sourceId) {
    let myConfig = config.bodies.miner;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
    this.spawnNewCreep(bodyParts, "miner", this.room.name, sourceId)
}

Spawn.prototype.spawnLorry = function(longDistance) {
  if (longDistance == false) {

      let myConfig = config.bodies.lorry;
      var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
      this.spawnNewCreep(bodyParts, "lorry", this.room.name)

  }
}

Spawn.prototype.spawnRepairer = function() {

    let myConfig = config.bodies.repairer;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
    this.spawnNewCreep(bodyParts, "repairer", this.room.name)

}

Spawn.prototype.spawnBuilder = function() {

    let myConfig = config.bodies.builder;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
    var type = "ALL_ROUND"
    this.spawnNewCreep(bodyParts, "builder", this.room.name, "", type)

}

Spawn.prototype.spawnUpgrader = function() {

    let myConfig = config.bodies.upgrader;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
    this.spawnNewCreep(bodyParts, "upgrader", this.room.name)
  }


Spawn.prototype.spawnAttacker = function(idleFlag) {
  /*if (this.canSpawn() != false) {
    spawn = this.canSpawn();
    var bodyParts = config.bodies.attacker[this.room.energyCapacityAvailable]
    this.spawnAttackCreep(bodyParts, "attacker", this.room.name)
  }*/
}
Spawn.prototype.spawnDefender = function() {
  /*  if (this.canSpawn() != false) {
      spawn = this.canSpawn();
      var bodyParts = config.bodies.defender(this.room.energyCapacityAvailable)
      this.spawnDefenseCreep(bodyParts, "defender", this.room.name)
    }*/
}
