
require('prototype.spawn')
require('prototype.room')
require('prototype.creep')
require('prototype.outpost')
require('prototype.SorterMan')
require('colonyManager')
require('prototype.flags')

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
  runColony();
})
};
