

module.exports = {

  run: function(creep) {
    var baseTier = 1;

    creep.checkDeath(creep)


    if (creep.tickToLive > 25){

      if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = "true";
      }
      if (creep.carry.energy == 0) {
        creep.memory.working = "false";
      }

      if (creep.carryCapacity != 0 && creep.memory.working == "true") {

        creep.building(creep)
          //CreepBuilding From Work
      }
      else if (creep.memory.working == "false") {
        creep.harvester(creep)
      }
      else {
        console.log("Needfixing? Hit an else in Role Builder")
      }


    }


  }


};
