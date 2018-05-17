require('nameGen')

const roleList = ['Harvester', 'Upgrader', 'Builder']
var minRoles1 = [{
  Harvester: 2
}, {
  Upgrader: 1
}]
var minRoles2 = [
  {Harvester: 2},
  {Upgrader: 1}
]
var baseTier = 1;
var spawnQueue = []



StructureSpawn.prototype.bodyCost = function(bodyParts){

    return bodyParts.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

StructureSpawn.prototype.bodyBuilder = function(role) {

  let outputArray = [];
  let room = this.room
  let maxEnergy = room.energyCapacityAvailable;

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
  let maxEnergy = room.energyCapacityAvailable;
  let energy = room.energyAvailable;
  let creepsInRoom = room.find(FIND_MY_CREEPS);
  let numberOfCreeps = {}
  let bodyParts = this.bodyBuilder()

  // loop and create list of available creeps

  for (let role of roleList) {
    numberOfCreeps[role] = _.sum(creepsInRoom, (creep) => creep.memory.role == role)

    if (numberOfCreeps[role].length < minRoles2[role]) {
      spawnQueue.push({
        role: role,
        bodyParts: bodyParts
      })
    } else {

      let harvNum = _.sum(creepsInRoom, (creep) => creep.memory.role == "Harvester")
      let upgrNum = _.sum(creepsInRoom, (creep) => creep.memory.role == "Upgrader")

      if (harvNum != 2){
      spawnQueue.push({
        role: "Harvester",
        bodyParts: bodyParts
      })
    }
    else if (upgrNum != 2){
    spawnQueue.push({
      role: "Upgrader",
      bodyParts: bodyParts
    })
  }
  else {
    return;
  }

    }
  }


  if(this.bodyCost(bodyParts) <= maxEnergy){
  let result = this.spawnNewCreep(energy, bodyParts, spawnQueue)

  if (result == -6 ) {
    //Waiting for resources

    console.log("Spawn: ",this.name, " Waiting with: ", spawnQueue[0].role)
    //console.log(JSON.stringify(spawnQueue))




  } else if (result == 0 || result == -4) {
    console.log("Spawned!")
  } else if (result != 0) {
    console.log(result)
    console.log("Error in spawning")
  }
  return this.spawnNewCreep(energy, bodyParts, spawnQueue)
}
};
