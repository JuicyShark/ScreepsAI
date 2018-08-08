require('prototype.spawn')
require('prototype.room')
require('prototype.creep')

module.exports.loop = function() {
  // Clean dead creeps from memory RIP fellow conrades
  for (let name in Memory.creeps) {
    if (Game.creeps[name] == undefined) {
      delete Memory.creeps[name];
    }
  }

  // for each spawn run spawn logic
  for (let spawnName in Game.spawns) {
    var energy = Game.spawns[spawnName].room.energyCapacityAvailable;
    Game.spawns[spawnName].findRoleNeeded(energy);
  }
  for(let roomName in Game.rooms){//Loop through all rooms your creeps/structures are in
      var room = Game.rooms[roomName];
      room.findSource(room);
    }

    if(!Memory.outposts){
      Memory.outposts = {}
    }else{
    for(let outpostRoom in Memory.outposts){
      var outpost = Object.create(room);
        outpost.name = outpostRoom;
        room.findSource(outpost);
    }
  }
  // for each creeps run creep logic
  for (let name in Game.creeps) {
    Game.creeps[name].runRole();
  }
};
