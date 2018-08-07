require('nameGen')

var minRoles = {
  Harvester: "1",
  Upgrader: "2",
  Builder: "2"
}
var baseTier = 1;
var spawnQueue = []

StructureSpawn.prototype.bodyCost = function(bodyParts) {

  return bodyParts.reduce(function(cost, part) {
    return cost + BODYPART_COST[part];
  }, 0);
}

StructureSpawn.prototype.bodyBuilder = function(role, energy) {
  let outputArray = [];
  let room = this.room
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
  var name = this.nameGen()
  return this.spawnCreep(bodyParts, name, {
    memory: {
      role: role,
      working: false
    }
  });
};

StructureSpawn.prototype.findRoleNeeded = function(energy) {
  // Find amount of different roles alive currently
  var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
  var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
  var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
  // Spawn top to bottom what roles need to meet minimum requirements
  if (numberOfHarvesters <= minRoles.Harvester) {
    bodyparts = this.bodyBuilder("harvester", energy);
    role = "harvester"
  } else if (numberOfUpgraders <= minRoles.Upgrader) {
    bodyparts = this.bodyBuilder("upgrader", energy);
    role = "upgrader"
  } else if (numberOfBuilders <= minRoles.Builder) {
    bodyparts = this.bodyBuilder("builder", energy);
    role = "builder"
  }
  this.spawnNewCreep(bodyparts, role);
};
