if (!(Outpost)) {
  var Outpost = Object.create(Object);
}

Outpost.prototype.OutpostCheck = function () {
  console.log("HI")
}


/** @function RoomObj=this
    @param {pos object} positionA
    @param {pos object} positionB */
Outpost.prototype.createRoadway = function(posA, posB) {

    let path = this.findPath(posA, posB, {
      ignoreCreeps: true,
      swampCost: 1
    })
    let remainingSites = function() {
      let mysites = _.size(this.memory.constructionSites)
      let out = mysites - 100;
      return out
    }
    if (path.length <= 99 && path.length <= remainingSites())
    var counting = 0


    for(var i in path) {
      this.createConstructionSite(path[i].x, path[i].y)
      counting++
    }



}
