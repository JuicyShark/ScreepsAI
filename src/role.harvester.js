module.exports = {
  run: function(creep) {
    creep.checkDeath(creep)

    if (creep.memory.working == "false") {
      creep.energyDeliver(creep)
    }
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = "false";
    }
    if (creep.carry.energy == 0) {
      creep.memory.working = "true";
    }
    if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "true") {
      creep.roleHarvester(creep)
    }
    else if (creep.carry.energy == creep.carryCapacity && creep.memory.working == "true"){
      creep.say("Nothing to do boss");
    }
  }
};
