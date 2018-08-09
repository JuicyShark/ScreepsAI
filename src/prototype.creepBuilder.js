/** @function
    @param {String} role
    @param {spawn} spawn
    @param {Number} energy */
StructureSpawn.prototype.roleToBuild = function(role, spawn, energy) {
  switch (role.toString()) {

    case "miner":
      return spawn.minerBuilder(energy)

    case "harvester":
     return spawn.basicBodyBuilder(energy)

    case "builder":
   return   spawn.basicBodyBuilder(energy)

    case "repairer":
   return   spawn.basicBodyBuilder(energy)

    case "lorry":
    return  spawn.lorryBuilder(energy)

    case "claimer":
    return  spawn.basicBodyBuilder(energy)

    case "upgrader":
   return   spawn.basicBodyBuilder(energy)
  }
}



StructureSpawn.prototype.basicBodyBuilder = function(energy) {
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

StructureSpawn.prototype.minerBuilder = function(energy) {
  let outputArray = [];
  energy = Math.floor(energy - 50);
  let numberOfParts = Math.floor(energy / 100);
  var body = [];

  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(WORK);
  }
    outputArray.push(MOVE);
  return outputArray
}

StructureSpawn.prototype.lorryBuilder = function(energy) {
  let outputArray = [];
  let numberOfParts = Math.floor(energy / 100);
  var body = [];

  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(MOVE);
  }
  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(CARRY);
  }
  return outputArray
}
