/** @function
    @param {String} role
    @param {Number} energy */
StructureSpawn.prototype.roleToBuild = function(role, energy) {
  switch (role.toString()) {

    case "miner":
      this.minerBuilder(energy)
      break;

    case "harvester":
      this.basicBodyBuilder(role, energy)
      break;

    case "builder":
      this.basicBodyBuilder(role, energy)
      break;

    case "repairer":
      this.basicBodyBuilder(role, energy)
      break;

    case "lorry":
      this.basicBodyBuilder(role, energy)
      break;

    case "claimer":
      this.basicBodyBuilder(role, energy)
      break;

    case "upgrader":
      this.basicBodyBuilder(role, energy)
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
  let numberOfParts = Math.floor(energy / 200);
  var body = [];

  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(WORK);
  }
  for (let i = 0; i < numberOfParts; i++) {
    outputArray.push(MOVE);
  }
  return outputArray
}
