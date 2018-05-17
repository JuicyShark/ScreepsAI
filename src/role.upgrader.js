
module.exports = {

  run: function(creep) {
      var baseTier = 1;
      var work = require("creepWork")


    if(creep.ticksToLive < 80 && creep.memory.deathWish != true){
      spawnQueue.push({role: 'Upgrader', bodyParts: bodyBuilder(Upgrader)})
      creep.say('Replacement added to Queue')
      creep.memory.deathWish = true
    }
    if(creep.ticksToLive < 50) {
      creep.say(creep.name, " The light! I see it!")
    }

    if (baseTier == 1){

      if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = "true";
      }
      if (creep.carry.energy == 0) {
        creep.memory.working = "false";
      }
      if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "false") {
        work.harvest(creep)
      }

      if (creep.carryCapacity != 0 && creep.memory.working == "true") {

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          const path = creep.pos.findPathTo(creep.room.controller);
          creep.memory.path = path;
          Memory.path = Room.serializePath(path);
          creep.moveByPath(Memory.path);

        }
      }
    }


  }


};
