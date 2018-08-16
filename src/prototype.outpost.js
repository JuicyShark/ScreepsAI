if (!(Outpost)) {
  var Outpost = Object.create(Object);
}

Outpost.prototype.OutpostCheck = function () {
  if(this.memory.isOutpost == true) {
    if(!(!this.canSpawn())) {
      if(!Memory.Colonies.outpost.spawnRoom[0]) {
        let ab = []
        ab.push(this.roomName)
        Memory.Colonies.outpost.spawnRoom = ab;
      } else {
      for(let i in Memory.Colonies.outpost.spawnRoom) {
        if(this.roomName != Memory.Colonies.outpost.spawnRoom[i]) {
          let ab = []
          ab.push(this.roomName)
          Memory.Colonies.outpost.spawnRoom = ab;
        }
      }
    }
  }
  }
}
Outpost.prototype.level3Things = function () {
  //called in line 48 of SorterMan
  if (this.level() >= 3) {
    this.checkRoadToSource();
    this.createRoadToController()
  }
}


/** @function RoomObj=this

    @param {pos object} ObjectIDA
    @param {pos object} ObjectIDB
 */
Outpost.prototype.createRoadway = function(ObjectIDA, ObjectIDB) {
  let tempA = Game.getObjectById(ObjectIDA);
  let tempB = Game.getObjectById(ObjectIDB);
  var posA = tempA.pos;
  var posB = tempB.pos;
    var path = this.findPath(posA, posB, {
      ignoreCreeps: true,
      ignoreRoads: true,
      swampCost: 1
    })
      let mysites = _.size(this.memory.constructionSites)
      let numSitesLeft = 100 - mysites;
      var constructionAdded = []
    if (path.length <= 99 && path.length <= numSitesLeft) {
        for (var i in path) {
          let constructGo = this.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
          if(constructGo == 0) {
            constructionAdded.push(path[i].x, path[i].y)
          }
          else if (constructGo == -8) {
            console.log("Construction que too large.. The numSitesLeft should solve this... needs fixing +!+!+!+!+")
          }
          else if (constructGo == -7 || constructGo == -10) {
            //console.log("Nope")
          }
          if (path[path.length] === constructionAdded.length) {
            var spawns = this.find(FIND_MY_SPAWNS)
            console.log("Path Done!")

              if(ObjectIDA == spawns[0].id) {
                this.memory.sourceNodes.ObjectIDA.toBuild.Road = false
              }
              else if (ObjectIDB == spawns[0].id) {
                this.memory.sourceNodes.ObjectIDB.toBuild.Road = false
              }
              else if (ObjectIDA == this.controller.id) {
                this.memory.sourceNodes.ObjectIDA.toBuild.Road = false
              }
              else if (ObjectIDB == this.controller.id) {
                this.memory.sourceNodes.ObjectIDB.toBuild.Road = false
              }
            }
          }
        }
      else if (path.length <= 99 && path.length >= numSitesLeft) {
        console.log("A Path is too long for your build list D:")
      }
      else {
        console.log("Other error for pathbuilding!")
      }

}
