module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = "true";
    }
    if (creep.carry.energy == 0) {
      creep.memory.working = "false";
    }
    if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "false") {
      creep.roleHarvester(creep)
    }
    if (creep.carryCapacity != 0 && creep.memory.working == "true") {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.ourPath(creep.room.controller);
      }
    }
  }
};
