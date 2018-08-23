module.exports = {

  run: function(creep) {
    var temp1 = [];
    var temp2 = [];

    if(creep.memory.targetRoom == "NoTarget" || creep.memory.targetRoom == null){
        for(var i in Memory.flags) {
          if(Memory.flags[i].name == "HarvestSources" && Memory.flags[i].needScout == true){
            temp1.push(Memory.flags[i].room)
            temp2 = Memory.flags[i]

          }
        }
      creep.memory.targetRoom = temp1.pop();
      temp2.needScout = false;
    }
    if (creep.room.name != creep.memory.targetRoom) {
      const exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
    const exit = creep.pos.findClosestByRange(exitDir);
    creep.moveTo(exit);
    } else if (creep.room.name == creep.memory.targetRoom) {

      if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.travelTo(creep.room.controller);
      }

    }
  }
};
