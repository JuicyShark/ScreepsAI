require('nameGen')

const roleList = ['Harvester', 'Upgrader', 'Builder']
var minRoles1 = [{
  Harvester: 2
}, {
  Upgrader: 1
}]
var baseTier = 1;
var spawnQueue = []
let maxEnergy = room.energyCapacityAvailable;

StructureSpawn.prototype.bodyCost = function(bodyParts){
    return bodyParts.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

StructureSpawn.prototype.bodyBuilder = function(role) {

  let outputArray = [];

  let numberOfParts = Math.floor(maxEnergy / 200);
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


StructureSpawn.prototype.spawnNewCreep = function(energy, bodyParts, spawnQueue) {
  var role = spawnQueue[0].role
  var name = this.nameGen()

  return this.spawnCreep(bodyParts, name, {
    memory: {
      role: role,
      working: false
    }
  });
};

StructureSpawn.prototype.createSpawnQueue = function() {
  let room = this.room
  let creepsInRoom = room.find(FIND_MY_CREEPS);
  let numberOfCreeps = {}
  let bodyParts = this.bodyBuilder()

  // loop and create list of available creeps

  for (let role of roleList) {
    numberOfCreeps[role] = _.sum(creepsInRoom, (creep) => creep.memory.role == role)
    console.log(minRoles1[role])
    if (numberOfCreeps[role].length < minRoles1[role]) {
      spawnQueue.push({
        role: role,
        bodyParts: bodyParts
      })
    } else {
      spawnQueue.push({
        role: "Harvester",
        bodyParts: bodyParts
      })
    }
  }
  var bodyParts = spawnQueue[0].bodyParts
  if(this.bodyCost(bodyParts) <= maxEnergy){
  let result = this.spawnCreep(bodyParts, dummyName);

  if (result == -6 && result != -4) {
    console.log("waiting")
  } else if (this.spawnNewCreep(energy, bodyParts, spawnQueue) == 0) {
    console.log("Spawned?")
  } else if (result != 0) {
    console.log(this.spawnNewCreep(energy, bodyParts, spawnQueue))
    console.log("Error in spawning")
  }
  return this.spawnNewCreep(energy, bodyParts, spawnQueue)
}
};
