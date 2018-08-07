
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
      if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "false") {
        creep.harvester(creep)
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
