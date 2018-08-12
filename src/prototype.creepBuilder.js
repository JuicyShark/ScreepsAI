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
