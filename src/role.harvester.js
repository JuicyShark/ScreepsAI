
module.exports = {

  run: function(creep) {
  var baseTier = 1;

    creep.checkDeath(creep)

    if (creep.ticksToLive > 25){


      if (creep.memory.working == "false"){
        creep.energyDeliver(creep)
      }
      if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = "false";
      }

      if (creep.carry.energy == 0) {
        creep.memory.working = "true";
      }

      if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "true") {
        creep.harvester(creep)

      }
    }


  }


};
