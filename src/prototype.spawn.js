require('nameGen')

var minRoles = {
  harvester: "0",
  upgrader: "1",
  builder: "1"
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
    console.log("Spawning a " + role + ", named " + name);
  } else {
    console.log("Spawn Unsuccesful");
  }
};

StructureSpawn.prototype.findRoleNeeded = function(energy) {
  if(!this.memory.totalRoles){
    this.memory.totalRoles = {};
    this.memory.totalRoles.harvester = 0;
  }
  // Find amount of different roles alive currently
  this.memory.minRoles = minRoles;
  for(var i in this.memory.minRoles){
  this.memory.totalRoles[i] = _.sum(Game.creeps, (c) => c.memory.role == i);
}
  // Spawn top to bottom what roles need to meet minimum requirements
  var canSpawn = false;
  for(var i in this.memory.totalRoles){
    if (this.memory.totalRoles[i] <= this.memory.minRoles[i]) {
      bodyParts = this.bodyBuilder([i], energy);
      role = i
      canSpawn = true;
    }
  }
  if (canSpawn == false && this.memory.totalRoles.harvester == 0) {
    this.spawnNewCreep([WORK, CARRY, MOVE], "harvester");
  } else if (canSpawn == true) {
    this.spawnNewCreep(bodyParts, role);
  }
};
