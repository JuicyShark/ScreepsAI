require('prototype.spawnFactory')
var minRoles = {
  harvester: "1",
  upgrader: "1",
  builder: "1",
  repairer: "0",
  miner: "1"
}

StructureSpawn.prototype.newCreepDebug = function(creepRole) {

};

StructureSpawn.prototype.findRoleNeeded = function(currentRoom) {
  // this = current spawn selected
  var energy = currentRoom.energyCapacityAvailable;
  if (!this.memory.totalRoles) {
    this.memory.totalRoles = {};
    return this.spawnNewCreep([WORK, CARRY, MOVE], "harvester", this);
  }
  // Find amount of different roles alive currently
  this.memory.minRoles = minRoles;
  for (var i in this.memory.minRoles) {
    this.memory.totalRoles[i] = _.sum(Game.creeps, (c) => c.memory.role == i);
    if (this.room.energyAvailable == energy) {
      if (this.memory.totalRoles[i] <= this.memory.minRoles[i] && this.spawning == null) {
        if (i == miner && Memory.availableSourceNodes.length >= 1) {
          var bodyParts = this.minerBuilder(energy)
          var role = i
          var sourceId = Memory.availableSourceNodes.shift(Memory.availableSourceNodes)
          return this.spawnNewCreep(bodyParts, role, currentRoom, sourceId)
        }
        var bodyParts = this.basicBodyBuilder(i, energy);
        var role = i
        return this.spawnNewCreep(bodyParts, role, currentRoom);
      }
    }
  }
};
