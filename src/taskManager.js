var tasks = require('tasks');

var taskManager = {

  run: function(){
    for(var roomName in Game.rooms){
      var room = Game.rooms[roomName];
      room.memory.availableCreeps = [];
    }
    for(var creep in Game.creeps){
      if(creep.memory.task == null){
        creep.room.memory.availableCreeps.push(creep.id)
      }
    }
  },

  assignTasks: function(){
    for(var creepId in Game.rooms.availableCreeps){
      var creep = Game.getObjectById(creepId)
      var task = creep.room.filtertask(creep.memory.type)
      creep.memory.task = task;
    }
  }
}


module.exports = taskManager;
