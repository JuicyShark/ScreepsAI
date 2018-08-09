module.exports = {

  run: function(creep) {
    let structure = creep.room.controller;
    if (creep.room.name != creep.memory.target) {
      var exit = creep.room.findExitTo(creep.memory.target);
      creep.ourPath(creep.pos.findClosestByRange(exit));
    } else {
      if (creep.claimController(structure) == ERR_NOT_IN_RANGE) {
        creep.ourPath(structure);
      }
    }
  }
};
