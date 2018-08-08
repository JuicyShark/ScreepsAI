

module.exports = {

  run: function(creep) {
    var baseTier = 1;

    creep.checkDeath(creep)


    if (creep.ticksToLive > 25){
//now creep will only work when ticktolive is over 25 ticks
      if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = "true";
      }
      if (creep.carry.energy == 0) {
        creep.memory.working = "false";
      }

      if (creep.carry.energy != 0 && creep.memory.working == "true") {

        creep.building(creep)
          //CreepBuilding From Work
      }
      else if (creep.memory.working == "false") {
        creep.energyCollection(creep)
      }
      else {
        
      }


    }


  }


};
