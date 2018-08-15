if (!(Outpost)) {
  var Outpost = Object.create(Object);
}

Outpost.prototype.OutpostCheck = function () {
  console.log("HI")
}
Outpost.prototype.level3Things = function () {
  //called in line 48 of SorterMan
  if (this.level() >= 3) {
    this.checkRoadToSource();
  }
}


/** @function RoomObj=this
    @param {pos object} positionA
    @param {pos object} positionB */
Outpost.prototype.createRoadway = function(posA, source) {

    var path = this.findPath(posA, source.pos, {
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
            break;
          }
          if (path[i] === path[path.length]) {
            this.memory.source.toBuild.Road = false;
          }
        }
      }
      else if (path.length <= 99 && path.length >= numSitesLeft) {
        console.log("A Path is too long for your build list D:")
      }
}
