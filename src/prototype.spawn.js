require('prototype.creepBuilder'),
require('nameGen')

var minRoles = {
  harvester: "0",
  upgrader: "1",
  miner: "1",
  lorry: "0",
  builder: "0",
  repairer: "0"
}

StructureSpawn.prototype.spawnNewCreep = function(bodyParts, role, home, sourceId) {
  if(sourceId == null){
    sourceId == "no Target"
  }

  var name = this.nameGen();
  var testCreep = this.spawnCreep(bodyParts, name, {
    dryRun: true
  });
  if (testCreep == 0) {
    this.spawnCreep(bodyParts, name, {
      memory: {
        role: role,
        working: "false",
        home: home,
        sourceId: sourceId
      }
    });
    console.log("Spawning a " + role + ", named " + name);
  } else {
    console.log("Spawn Unsuccesful");
  }
};


StructureSpawn.prototype.findRoleNeeded = function(currentRoom) {
  // this = current spawn selected
  var energy = currentRoom.energyCapacityAvailable;
  if (!this.room.memory.totalRoles) {
    this.room.memory.totalRoles = {};
    return this.spawnNewCreep([WORK, CARRY, MOVE], "harvester", this);
  }
  // Find amount of different roles alive currently
  this.room.memory.minRoles = minRoles;
  for (var i in this.room.memory.minRoles) {
  this.room.memory.totalRoles[i] = _.sum(Game.creeps, (c) => c.memory.role == i);
    if (this.room.energyAvailable == energy) {
      if (this.room.memory.totalRoles[i] <= this.room.memory.minRoles[i] && this.spawning == null) {
        var bodyParts = this.roleToBuild(i, this, energy)
        return this.spawnNewCreep(bodyParts, i, currentRoom);
      }
    }
  }
};
