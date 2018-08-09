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
      break;

    case "builder":
   return   spawn.basicBodyBuilder(energy)
      break;

    case "repairer":
   return   spawn.basicBodyBuilder(energy)
      break;

    case "lorry":
    return  spawn.basicBodyBuilder(energy)
      break;

    case "claimer":
    return  spawn.basicBodyBuilder(energy)
      break;

    case "upgrader":
   return   spawn.basicBodyBuilder(energy)
      break;
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
