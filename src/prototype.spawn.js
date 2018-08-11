require('prototype.creepBuilder'),
require('nameGen')

var minRoles = {
  harvester: "0",
  upgrader: "2",
  miner: "0",
  lorry: "2",
  builder: "0",
  repairer: "0"
}

StructureSpawn.prototype.spawnNewCreep = function(bodyParts, role, home, sourceId, idleFlag) {
  if(sourceId == null || sourceId == "n/a"){
    sourceId == "no Target"
  }
  if (idleFlag == null){
    idleFlag == "no Flag"
  }

  var name = this.nameGen();
  var testCreep = this.spawnCreep(bodyParts, name, {
    dryRun: true
  });
  if (testCreep == 0) {
    this.spawnCreep(bodyParts, name, {
      memory: {
        role: role,
        working: "false",
        home: home,
        sourceId: sourceId,

      }
    });
    console.log("Spawning a " + role + ", named " + name);
  } else if (this.spawning){
    console.log("Spawning " + role);
  } else {
    if (Game.time % 5 === 0) {
    console.log("Spawn waiting with " + role)
  }
  }
};

StructureSpawn.prototype.spawnAttackCreep = function(bodyParts, role, home, idleFlag) {

}
StructureSpawn.prototype.spawnDefenseCreep = function(bodyParts, role, home, idleFlag) {

}
