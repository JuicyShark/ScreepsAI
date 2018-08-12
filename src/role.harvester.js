module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    if (creep.memory.working == "false") {
      creep.findDeliveryTarget()

    }
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = "false";
    }
    if (creep.carry.energy == 0) {
      creep.memory.working = "true";
    }
    if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "true") {
      creep.getEnergy(false, true)
    } else if (creep.carry.energy == creep.carryCapacity && creep.memory.working == "true") {}
  }
};
