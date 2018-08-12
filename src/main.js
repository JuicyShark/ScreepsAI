
require('prototype.spawn')
require('prototype.room')
require('prototype.creep')
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
  for (let name in Memory.creeps) {
    if (Game.creeps[name] == undefined) {
      delete Memory.creeps[name];
    }
  }

  //Loop through all rooms your creeps/structures are in
  for (let roomName in Game.rooms) {
    var currentRoom = Game.rooms[roomName];
    currentRoom.tick();
  }


  // for each creeps run creep logic
  for (let name in Game.creeps) {

  //  Game.creeps[name].suicide();
    Game.creeps[name].runRole();
  }

})
};
