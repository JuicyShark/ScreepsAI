module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = "true";
    }
    if (creep.carry.energy == 0) {
      creep.memory.working = "false";
    }
    if (creep.carry.energy != 0 && creep.memory.working == "true") {
      creep.roleRepairer(creep)
    } else if (creep.memory.working == "false") {
     creep.energyCollection(creep)
    } else {
    }
  }
};
