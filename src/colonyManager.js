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
  for (let roomName in Game.rooms) {
    var currentRoom = Game.rooms[roomName];
    currentRoom.runLogic();

  }
}
/*colonyManager.prototype.
colonyManager.prototype.
colonyManager.prototype.
colonyManager.prototype.
*/
colonyManager.prototype.colonyMemInit = function() {
  if (!Memory.Colonies) {
    var config = require("config")
    Memory.Colonies = config.DefaultMem.colonyMem;
  }
}
