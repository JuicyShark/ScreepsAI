

module.exports = {

  run: function(creep) {
    var baseTier = 1;

    if(creep.ticksToLive < 80 && creep.memory.deathWish != true){
      spawnQueue.push({role: 'Builder', bodyParts: bodyBuilder(Builder)})
      creep.say('Replacement added to Queue')
      creep.memory.deathWish = true
    }
    if(creep.ticksToLive < 25) {
      creep.say(creep.name, " Ol mate your times up")
    }

    if (baseTier == 1){

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
