require('nameGen');
var roleList = ['Harvester', 'Upgrader', 'Builder']
var minRoles1 = [{Harvester: 2}, {Upgrader: 1}]
var baseTier = 1;
var spawnQueue = []
module.exports = function() {
  StructureSpawn.prototype.bodyBuilder = function(role){
  console.log(role);
  return ['WORK','CARRY','MOVE']
  };
StructureSpawn.prototype.createSpawnQueue = function(){
let room = this.room
let creepsInRoom = room.find(FIND_MY_CREEPS);
let numberOfCreeps = {}
// loop and create list of available creeps
for (let role of roleList){
  numberOfCreeps[role] = _.sum(creepsInRoom, (creep) => creep.memory.role == role)
  if (numberOfCreeps[role].length < minRoles1[role]){
    spawnQueue.push({role: role, bodyParts: bodyBuilder(role)})
    if(spawnQueue[0] != null){
    this.spawnNewCreep(energy, spawnQueue)
  }
  }
}
};
  StructureSpawn.prototype.spawnNewCreep = function(energy, spawnQueue){
    var role = spawnQueue[0].role
    var bodyParts = spawnQueue[0].parts
    var name = this.nameGen();
    return this.spawnCreep (bodyParts, name, {role: role, working: false})
  };
};
