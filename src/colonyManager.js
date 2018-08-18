if (!(colonyManager)) {
  var colonyManager = Object.create(Object);
}

colonyManager.prototype.runColony = function() {

  colonyMemInit();
  creepManager();
  roomManager();
  flagManager();

}
colonyManager.prototype.flagManager = function() {
  for(var i in Game.flags) {
    var currentFlag = Game.flags[i];
    currentFlag.flagTick();

  }
}
colonyManager.prototype.creepManager = function() {
  // for each creeps run creep logic
  for (let name in Game.creeps) {

  //  Game.creeps[name].suicide();
    Game.creeps[name].runRole();
  }
}
colonyManager.prototype.roomManager = function() {

  //Loop through all rooms your creeps/structures are in
  for (let roomName in Game.colonies.bases) {
    var currentRoom = Game.colonies.bases[roomName];
    currentRoom.runLogic();
  }
  for (let roomName in Game.colonies.outposts) {
    var currentRoom = Game.colonies.outposts[roomName];
    currentRoom.runLogic();
  }for (let roomName in Game.colonies.outposts) {
    var currentRoom = Game.colonies.outposts[roomName];
    currentRoom.runLogic();
  }
}
/*colonyManager.prototype.
colonyManager.prototype.
colonyManager.prototype.
colonyManager.prototype.
*/
colonyManager.prototype.colonyMemInit = function() {
  if (!Memory.colonies) {
    var config = require("config")
    Memory.colonies = config.defaultMem.colonyMem;
  }
}
