require('prototype.spawn')
require('prototype.room')
require('prototype.creep')
// Turn off any of the below features by passing false.
require('screeps-perf')({
  speedUpArrayFunctions: true,
  cleanUpCreepMemory: true,
  optimizePathFinding: true
});
//const profiler = require('screeps-profiler');

//profiler.enable();
module.exports.loop = function() {
  // profiler.wrap(function() {
  // Clean dead creeps from memory RIP fellow conrades
  for (let name in Memory.creeps) {
    if (Game.creeps[name] == undefined) {
      delete Memory.creeps[name];
    }
  }

  // for each spawn run spawn logic
  for (let spawnName in Game.spawns) {
    var currentRoom = Game.spawns[spawnName].room
    Game.spawns[spawnName].findRoleNeeded(currentRoom);
  }
  //Loop through all rooms your creeps/structures are in
  for (let roomName in Game.rooms) {
    var currentRoom = Game.rooms[roomName];
    //currentRoom.findSource(currentRoom);
    //currentRoom.needRepairer();
  }

  /*  if(!Memory.outposts){
      Memory.outposts = {}
    }else{
    for(let outpostRoom in Memory.outposts){
      var outpost = Object.create(room);
        outpost.name = outpostRoom;
        room.findSource(outpost);
    }
  } */
  // for each creeps run creep logic
  for (let name in Game.creeps) {
    Game.creeps[name].runRole();
  }
//});
};
