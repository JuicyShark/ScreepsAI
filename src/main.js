require('prototype.spawn')
require('prototype.creep')


module.exports.loop = function () {
// Clean dead creeps from memory RIP fellow conrades
    for(let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }


    // for each spawn run spawn logic
    for(let spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName];
      var energy = spawn.room.energyCapacityAvailable;
       spawn.findRoleNeeded(energy);

       if(!spawn.memory.sourceNodes){
           spawn.memory.sourceNodes = {};
           var sourceNodes = spawn.room.find(FIND_SOURCES);
           for(var i in sourceNodes){
            source = sourceNodes[i];
              source.memory = spawn.memory.sourceNodes[source.id] = {};
              source.memory.workers = 0
           }
           }else{
               var sourceNodes = spawn.room.find(FIND_SOURCES);
           for(var i in sourceNodes){
            source = sourceNodes[i];
              source.memory = spawn.memory.sourceNodes[source.id];
           }



       }
    }

    // for each creeps run creep logic
    for(let name in Game.creeps) {
        Game.creeps[name].runRole();
    }



};
