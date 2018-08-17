require('prototype.creepBuilder'),
require('nameGen')

StructureSpawn.prototype.spawnNewCreep = function(bodyParts, role, home, sourceId, targetRoom, thisFlag) {
  var thisFlagName = ""
  if(sourceId == null || sourceId == "n/a"){
    sourceId = "NoSource";
  }
  if(targetRoom == null || targetRoom == "n/a"){
    targetRoom = "NoTarget";
  }
  if(thisFlag == null || thisFlag == "n/a"){
    thisFlag = "NoFlag";
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
        home: home.name,
        sourceId: sourceId,
        targetRoom: targetRoom,
        targetFlag: thisFlag

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
