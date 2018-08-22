var tasks = require('tasks');

var taskManager = {

  run: function(){
    for(var roomName in Game.rooms){
      var room = Game.rooms[roomName];
      room.memory.availableCreeps = [];
    }
    for(var creepId in Game.creeps){
        var creep = Game.creeps[creepId]
      if(creep.memory.task == null){
        creep.room.memory.availableCreeps.push(creep.id)
      }

        else if(creep.memory.task.name == "HARVEST") {
          tasks.harvestTask(creep)
        }
      else if(creep.memory.task.name == "BUILD") {
          tasks.buildTask(creep)
        }
        else if(creep.memory.task.name == "UPGRADE") {
          tasks.upgradeTask(creep);
        }
        else if(creep.memory.task.name == "REPAIR") {
          tasks.repairTask(creep);
        }
      }
  },

  assignTasks: function(){
    for(var roomName in Game.rooms){
        var room = Game.rooms[roomName];
       if(room.memory.availableCreeps.length != 0){
        for(var i = 0; i < room.memory.availableCreeps.length; i++){
        var creepId = room.memory.availableCreeps[i]
      var creep = Game.getObjectById(creepId)
      if(creep.spawning != true){
      var task = creep.room.filtertask(creep.memory.type)
      creep.memory.task = task;
    }
    }
    }
  }
  }
}


module.exports = taskManager;
