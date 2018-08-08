require('nameGen')

var minRoles = {
  Harvester: "2",
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


StructureSpawn.prototype.spawnNewCreep = function(bodyParts, role) {
  if(this.spawning == null){
  var name = undefined;
   name = this.nameGen();
   var testIfCanSpawn = this.spawnCreep(bodyParts, name, {
    dryRun: true
  });
   this.spawnCreep(bodyParts, name, {
    memory: {
      role: role,
      working: false
    }
  });
  console.log("Spawning a " + role + ", Named: "+ name);
}
};

StructureSpawn.prototype.findRoleNeeded = function(energy) {
  // Find amount of different roles alive currently
  var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
  var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
  var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    // Spawn top to bottom what roles need to meet minimum requirements
var canSpawn = false;
  if (numberOfHarvesters <= minRoles.Harvester) {
    bodyParts = this.bodyBuilder("harvester", energy);
    role = "harvester"
    canSpawn = true;
  } else if (numberOfUpgraders <= minRoles.Upgrader) {
    bodyParts = this.bodyBuilder("upgrader", energy);
    role = "upgrader"
      canSpawn = true;
  } else if (numberOfBuilders <= minRoles.Builder) {
    bodyParts = this.bodyBuilder("builder", energy);
    role = "builder"
      canSpawn = true;
  }
  if(canSpawn == true){
    this.spawnNewCreep(bodyParts, role);
    canSpawn = false;
  }
};
