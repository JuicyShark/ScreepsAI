require('prototype.creepBuilder'),
require('nameGen')
var config = require("config")

StructureSpawn.prototype.spawnNewCreep = function(bodyParts, home, type, sourceId) {

  var name = this.nameGen();
  var testCreep = this.spawnCreep(bodyParts, name, {
    dryRun: true
  });
  if (testCreep == 0) {
    var task = [];
    this.spawnCreep(bodyParts, name, {
      memory: {
        working: "false",
        home: home,
        type: type,
        task: task,
        sourceId: sourceId
      }
    });
    console.log("Spawning a " + type + ", named " + name);
  } else if (this.spawning){
    console.log("Spawning " + type);
  } else {
    if (Game.time % 5 === 0) {
    console.log("Spawn waiting with " + type)
  }
  }
};

Spawn.prototype.spawnReserver = function(roomName, flag) {
    var bodyParts = config.bodies.claimer
    this.spawnNewCreep(bodyParts, "claimer", this.room.name, "RESERVER")

  }



Spawn.prototype.spawnClaimer = function(roomName, thisFlag) {
    var bodyParts = config.bodies.claimer
    this.spawnNewCreep(bodyParts, "claimer", this.room.name, "CLAIMER")
    //thisFlag.hasClaimer = true;
  }



Spawn.prototype.spawnAllRounder = function() {
      let myConfig = config.bodies.allRounder;
      var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
      this.spawnNewCreep(bodyParts, this.room.name, "ALL_ROUND",)
}

Spawn.prototype.spawnContainerMiner = function() {
    let myConfig = config.bodies.miner;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
    this.spawnNewCreep(bodyParts, this.room.name, "CONTAINER_MINER")
}

Spawn.prototype.spawnLorry = function(longDistance) {
  if (longDistance == false) {

      let myConfig = config.bodies.lorry;
      var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
      this.spawnNewCreep(bodyParts, this.room.name, "LORRY")

  }
}

Spawn.prototype.spawnUpgrader = function() {

    let myConfig = config.bodies.upgrader;
    var bodyParts = myConfig.defaults[myConfig.bodyReturn(this.room.energyCapacityAvailable)]
    this.spawnNewCreep(bodyParts, this.room.name, "UPGRADER")
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
