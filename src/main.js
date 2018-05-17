require('prototype.spawn')
require('prototype.creep')

module.exports.loop = function () {
// Clean dead creeps from memory RIP fellow conrades
    for(let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    // for each creeps run creep logic
    for(let name in Game.creeps) {
        Game.creeps[name].runRole();
    }


    // for each spawn run spawn logic
    for(let spawnName in Game.spawns) {

       Game.spawns[spawnName].createSpawnQueue();
       //Game.spawns[spawnName].spawnNewCreep();
    }
};
