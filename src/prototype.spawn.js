require('prototype.creepBuilder'),
require('nameGen')

StructureSpawn.prototype.spawnNewCreep = function(bodyParts, role, home, sourceId) {
  if(sourceId == null || sourceId == "n/a"){
    sourceId == "no Target"
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
        sourceId: sourceId

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
