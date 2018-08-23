
require('prototype.spawn')
require('prototype.room')
require('prototype.creep')
require('prototype.outpost')
require('prototype.SorterMan')
//require('colonyManager')
require('prototype.flags')
require('prototype.tower')
var taskManager = require('taskManager')

// Turn off any of the below features by passing false.
require('screeps-perf')({
  speedUpArrayFunctions: true,
  cleanUpCreepMemory: true,
  optimizePathFinding: false
});
const profiler = require('screeps-profiler');

profiler.enable();
module.exports.loop = function() {
  profiler.wrap(function() {
  // Clean dead creeps from memory RIP fellow conrades
  for (var name = 0; name < Memory.creeps; name++) {
    if (Game.creeps[name] == undefined) {
      delete Memory.creeps[name];
    }
  }
    for(var i = 0; i < Game.flags; i++) {
      var currentFlag = Game.flags[i];
      currentFlag.tick();

    }

    //Loop through all rooms your creeps/structures are in
    for (var roomName = 0; roomName < Game.rooms; roomName++) {
      var currentRoom = Game.rooms[roomName];



      currentRoom.runLogic()
    }
        taskManager.run()
        taskManager.assignTasks()
    // find all towers
       var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
       // for each tower
       for (let tower of towers) {
           // run tower logic
           tower.defend();
       }


})
};
