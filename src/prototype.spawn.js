require('nameGen')

var minRoles = {
  Harvester: "0",
  Upgrader: "1",
  Builder: "1"
}

StructureSpawn.prototype.bodyBuilder = function(role, energy) {
  let outputArray = [];
  let numberOfParts = Math.floor(energy / 200);
  var body = [];

  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(WORK);
  }
  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(CARRY);
  }
  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(MOVE);
  }
  return outputArray
}

StructureSpawn.prototype.newCreepDebug = function(creepRole) {
  if (this.spawning != null) {
    let name = this.spawning.name;
    let timeLeft = this.spawning.remainingTime;
  } else if (this.spawning == null) {
    //spawning logic to be implimented here. Well reference to it to clean it out of main.
  }
};


StructureSpawn.prototype.spawnNewCreep = function(bodyParts, role) {
  var name = this.nameGen();
  var testCreep = this.spawnCreep(bodyParts, name, {
    dryRun: true
  });
  if (testCreep == 0) {
    this.spawnCreep(bodyParts, name, {
      memory: {
        role: role,
        working: false
      }
    });
     console.log("Spawning a " + role + ", named " + name + " in: " + this.spawning.remainingTime + " Ticks.")
  } else {
    console.log("Spawn Unsuccesful");
  }
};

StructureSpawn.prototype.findRoleNeeded = function(energy) {
  // Find amount of different roles alive currently
  this.memory.minRoles = minRoles;
  var harvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
  var upgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
  var builders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
  this.memory.totalRoles = {harvesters, upgraders, builders}
  // Spawn top to bottom what roles need to meet minimum requirements
  var canSpawn = false;
  if (this.memory.totalRoles.harversters <= minRoles.Harvester) {
    bodyParts = this.bodyBuilder("harvester", energy);
    role = "harvester"
    canSpawn = true;
  } else if (this.memory.totalRoles.upgraders <= minRoles.Upgrader) {
    bodyParts = this.bodyBuilder("upgrader", energy);
    role = "upgrader"
    canSpawn = true;
  } else if (this.memory.totalRoles.builders <= minRoles.Builder) {
    bodyParts = this.bodyBuilder("builder", energy);
    role = "builder"
    canSpawn = true;
  }
  if (canSpawn == true) {
    this.spawnNewCreep(bodyParts, role);
  }
};
