
var tasks = {

  upgradeTask: function(creep) {
    if(creep.memory.task.name == "UPGRADE"){
    creep.checkDeath();
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = "true";
    }
    if (creep.carry.energy == 0) {
      creep.memory.working = "false";
    }
    if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "false") {
      creep.getEnergy(true, true)
    }
    if (creep.carryCapacity != 0 && creep.memory.working == "true") {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.ourPath(creep.room.controller);
      }
    }
  }}
}


module.exports = tasks;
