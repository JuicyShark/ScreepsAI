require("prototype.spawn")
var config = require("config")


Room.prototype.createNeeds = function() {
  if (this.needBasicWorker()) {
    this.spawnHarvester("n/a", "n/a")
  } else if (this.needLorry()) {
    let longDistance = false
    this.spawnLorry(longDistance) // false meaning long distance or not
  } else if (this.needContainerMiner()) {
    for (var i in this.memory.sourceNodes) {
      if (this.memory.sourceNodes[i].miners == 0) {
        this.spawnContainerMiner(this.memory.sourceNodes[i].id)
      }
    }
  } else if (this.needUpgrader()) {
    this.spawnUpgrader()
  } else if (this.needBuilder()) {
    this.spawnBuilder()
  } else if (this.needRepairer()) {
    this.spawnRepairer()
  } else if (this.needDefender()) {
    this.spawnDefender()
  }
  /*else if (this.needClaimer()){
  }*/
  /*  else if (this.needA) {
    }*/
  else if (this.needSourceScouts()) {
    let theReturned = this.needSourceScouts()
    let roomName = theReturned[0]
    let flag = theReturned[1]
    this.spawnHarvester(roomName, flag.name)
  } else {
    console.log("Needs have been Met!")
    console.log(this.energyAvailable + "/" + this.energyCapacityAvailable + " Is the energy Capacity of the room")
  }
}
