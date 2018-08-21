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
    }
  },

  assignTasks: function(){
    for(var roomName in Game.rooms){
        var room = Game.rooms[roomName];
       if(room.memory.availableCreeps.length != 0){
        for(var i = 0; i < room.memory.availableCreeps.length; i++){
        var creepId = room.memory.availableCreeps[i]
      var creep = Game.getObjectById(creepId)
      var task = creep.room.filtertask(creep.memory.type)
      creep.memory.task = task;}
    }
  }
  }
}


module.exports = taskManager;
