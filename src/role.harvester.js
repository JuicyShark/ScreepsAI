

module.exports = {

  run: function(creep) {


    if(creep.ticksToLive < 80 && creep.memory.deathWish != true){
      spawnQueue.push({role: 'Harvester', bodyParts: bodyBuilder(Harvester)})
      creep.say('Replacement added to Queue')
      creep.memory.deathWish = true
    }
    if(creep.ticksToLive < 50) {
      creep.say(creep.name, " Ol bugger your out of luck now")
    }
    if (baseTier == 1){

      if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = "false";
      }
      if (creep.carry.energy == 0) {
        creep.memory.working = "true";
      }

      if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "true") {
        creep.harvest(creep)
      }
      else if (creep.memory.working == false){
        creep.energyDeliver(creep)
      }
      else {
        console.log("Needfixing? Hit an else in Role Harvester")
      }


    }


  }


};
