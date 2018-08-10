require("prototype.spawn")

Room.prototype.tick = function() {
  if(this.isMine()) {
    this.processAsOwner(); //dont think we want them?
  } else {
    this.processAsGuest(); //dont think we want them?
  }
}
Room.prototype.isMine = function() {
  return this.controller && this.controller.my
}

Room.prototype.findSource = function(room) {
  if (!room.memory.sourceNodes) {
    room.memory.sourceNodes = {};
    var sourceNodes = room.find(FIND_SOURCES);
    for (var i in sourceNodes) {
      var source = sourceNodes[i];
      source.memory = room.memory.sourceNodes[source] = {};
      source.memory.workers = 0;
    }
  } else {
    var sourceNodes = room.find(FIND_SOURCES);
    for (var i in sourceNodes) {
      var source = sourceNodes[i];
      source.memory = this.memory.sourceNodes[source];
    }
  }
}
Room.protype.createNeeds = function(){
    if (this.needHarvester()) {
      //this.spawnHarvester()
    }
    else if (this.needContainerMiner()){
      //this.spawnContainerMiner
    }
}


Room.prototype.needContainerMiner = function(){
  for(var i in this.memory.sourceNodes){
    if(this.memory.sourceNodes[i].workers == 0){
   this.spawnMiner(i.id);
  }
    }
  }


Room.prototype.spawnMiner = function(sourceId) {
  spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS)
  console.log(spawn);
  if(spawn.energyCapacityAvailable){

    var bodyParts = spawn.roleToBuild("miner", spawn, spawn.energyCapacityAvailable)
    spawn.spawnNewCreep(bodyParts, "miner", spawn.room, sourceId)
  }

}
