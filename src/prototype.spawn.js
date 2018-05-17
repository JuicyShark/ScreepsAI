//require('nameGen');
var roleList = ['Harvester', 'Upgrader', 'Builder']
var minRoles1 = [{Harvester: 2}, {Upgrader: 1}]
var baseTier = 1;
var spawnQueue = []
var energy = 300;

  StructureSpawn.prototype.bodyBuilder = function(role) {

    let outputArray = [];

    let numberOfParts = Math.floor(300 / 200);
    var body = [];
    for (let qwq = 0; qwq < numberOfParts; qwq++) {
        outputArray.push(WORK);
    }
    for (let qwq = 0; qwq < numberOfParts; qwq++) {
        outputArray.push(CARRY);
    }
    for (let qwq = 0;qwq< numberOfParts; qwq++) {
        outputArray.push(MOVE);
    }

    return outputArray;
  }




  StructureSpawn.prototype.spawnNewCreep = function(energy, spawnQueue){

    var role = spawnQueue[0].role

    var bodyParts = spawnQueue[0].bodyParts

    //var name = require('nameGen');
    var name = Game.time + " Harvesta"
    //console.log(JSON.stringify(name))
    //console.log(bodyParts)
    return this.spawnCreep(bodyParts, name, { memory: {
        role: role,
        working: false
    }
       });
  };

  StructureSpawn.prototype.createSpawnQueue = function(){
    let room = this.room
    let creepsInRoom = room.find(FIND_MY_CREEPS);
    let numberOfCreeps = {}
    let bodyParts = this.bodyBuilder()

// loop and create list of available creeps

    for (let role of roleList){
  numberOfCreeps[role] = _.sum(creepsInRoom, (creep) => creep.memory.role == role)

  if (numberOfCreeps[role].length < minRoles1[role]){
    spawnQueue.push({role: role, bodyParts: bodyParts})
  }
  else {

    spawnQueue.push({role: "Harvester", bodyParts: bodyParts})
  }
}

  let result = this.spawnNewCreep(energy, spawnQueue);

  if (result == 6 && result != 4) {
    console.log("waiting")
  }
  else if (this.spawnNewCreep(energy,spawnQueue) == 0) {
    console.log("Spawned?")
  }
  else if (result != 0) {
    console.log(this.spawnNewCreep(energy, spawnQueue))
    console.log("Error in spawning")
  }
return this.spawnNewCreep(energy, spawnQueue)

}
