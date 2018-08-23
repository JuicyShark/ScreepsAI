require('prototype.spawn')
require('prototype.room')
require('prototype.creep')
require('prototype.outpost')
require('prototype.SorterMan')
//require('colonyManager')
require('prototype.structures')
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
    Object.keys(Memory.creeps).forEach(i => {
      if (Game.creeps[i] == undefined) {
        delete Memory.creeps[i];
      }
    })
    Object.keys(Game.flags).forEach(i => {
      var currentFlag = Game.flags[i];
      currentFlag.tick();
    })

    //Loop through all rooms your creeps/structures are in
    Object.keys(Game.rooms).forEach(roomName => {
      Game.rooms[roomName].runLogic()
    })
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
