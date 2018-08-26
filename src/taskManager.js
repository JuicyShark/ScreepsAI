var tasks = require('tasks');

var taskManager = {

  run: function() {
    Object.keys(Game.rooms).forEach(roomName => {
      var room = Game.rooms[roomName];
      room.memory.availableCreeps = [];
    })
    Object.keys(Game.creeps).forEach(creepId => {
      var creep = Game.creeps[creepId]
      if (creep.memory.task == null) {
        creep.room.memory.availableCreeps.push(creep.id)
      } else if (creep.memory.task.name == "HARVEST") {
        tasks.harvestTask(creep)
      } else if (creep.memory.task.name == "BUILD") {
        tasks.buildTask(creep)
      } else if (creep.memory.task.name == "UPGRADE") {
        tasks.upgradeTask(creep);
      } else if (creep.memory.task.name == "REPAIR") {
        tasks.repairTask(creep);
      } else if (creep.memory.task.name == "CONTAINER_MINE") {
        tasks.minerTask(creep);
      } else if (creep.memory.task.name == "LORRYS") {
        tasks.lorryTask(creep);
      }
    })
  },

  assignTasks: function() {
    Object.keys(Game.rooms).forEach(roomName => {
      var room = Game.rooms[roomName];
      if (room.memory.availableCreeps.length != 0) {
        for (var i = 0; i < room.memory.availableCreeps.length; i++) {
          var creepId = room.memory.availableCreeps[i]
          var creep = Game.getObjectById(creepId)
          if (creep != null) {
            if (creep.spawning != true) {
              var task = creep.room.filtertask(creep.memory.type)
              //console.log("FILTERED TASK" + task + creep.memory.type)
              creep.memory.task = task;

            }
          }
        }
      }
    })
  }
}


module.exports = taskManager;
