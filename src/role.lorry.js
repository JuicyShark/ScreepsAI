module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    if (creep.memory.working == "false") {
      creep.getEnergy(true, false)
    }
    if (creep.carry.energy == creep.carryCapacity && creep.memory.working == "false") {
      creep.memory.working = "true";
    }
    if (creep.carry.energy == 0 && creep.memory.working == "true") {
      creep.memory.working = "false";
    }
    if (creep.memory.working == "true") {
      creep.findDeliveryTarget(creep)
    }
  }
};
