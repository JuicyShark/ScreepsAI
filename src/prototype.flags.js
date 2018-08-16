

Flag.prototype.tick = function() {
  this.initFlagMem()
  this.longDistanceMining()
}

Flag.prototype.initFlagMem = function() {
  if (!this.memory.colours) {
    this.memory.name = this.name;
    this.memory.room = this.pos.roomName;
    let flagColours = []
    flagColours.push(this.color)
    flagColours.push(this.secondaryColor)
    this.memory.colours = flagColours;
    if (this.name == "ClaimRoom") {
      this.memory.hasClaimer = false;
    }
  }


}

Flag.prototype.longDistanceMining = function() {
  if(this.name != "HarvestSources") {
    return false
  }
  else {
    this.memory.reserving = false;
    return true;
  }
}

Flag.prototype.initAttackFlag = function() {
  let atkflg = Config.attackFlagMemory
  Memory.flags[this] = atkflg;
}

Flag.prototype.attackLogic = function() {



}

Flag.prototype.flagSelector = function() {

    determineFlagBuilding = function () {

      if (this.room.find(FIND_MY_CONSTRUCTION_SITES).length >= 100) {
          return;
          //this is here to try to exit this if building que is full or reached its limit. I think..
        }
        let flagName = this.name;

        if (flagName == "Road") {
          //have a function for this...
          return;
        } else if (flagName == "Container") {
          let buildContainer = this.room.createConstructionSite(this.pos, STRUCTURE_CONTAINER);
          if (buildContainer == 0) {

            return true;
          } else if (buildContainer != 0) {
            console.log(buildContiner)
            console.log("====Debugging ProtoFlags!====")
          }
          //above ready for debug
        } else if (flagName == "Extension") {
          let buildExtension = this.room.createConstructionSite(this.pos, STRUCTURE_EXTENSION);
          if (buildExtension == 0) {
            return true;
          } else if (buildExtension != 0) {
            console.log(buildExtension)
            console.log("====Debugging ProtoFlags!====")
          }
          //above ready for debug
        } else if (flagName == "ClaimRoom") {
          //here is where we change room memory to claim status? therefore initiating a claim creep to be created/added to que?
        }

      } // end of function call

      if (determineFlagBuilding()) {
        return;
      } else {
        console.log("did not return True?! Maybe this isnt needed...")
      }

    }
