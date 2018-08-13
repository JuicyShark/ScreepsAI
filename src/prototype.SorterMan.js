if (!(SorterMan)) {
  var SorterMan = Object.create(Object);
}

SorterMan.prototype.sortComplete = function() {
  if (!this.memory.sortComplete || this.memory.sortComplete == false) {
    return false
  }
  else {
    return true;
  }
}
SorterMan.prototype.reCheckRooms = function() {

}
SorterMan.prototype.sortRoom = function() {
  if (!this.memory.sortComplete) {
    this.memory.sortComplete = false;
  }
  if(!(this.isMine())) {
    console.log("Not my room!" + this.name)
    this.memory.sortComplete = true;
  }
  else if (this.isMine() && !(this.sortComplete())) {
    if (this.controller.level <= 7) {
      if (!(this.memory.isOutpost) || this.memory.isOutpost == false) {
      this.memory.isOutpost = true;
      }
      this.memory.sortComplete = true;
    }
    else if (this.controller.level == 8) {
      if (!(this.memory.isCastle) || this.memory.isCastle == false){
        this.memory.isCastle = true;
        this.memory.isOutpost = false
      }
      this.memory.sortComplete = true;
    }
  }
}

SorterMan.prototype.runLogic = function() {
  if(!this.sortComplete()){

    this.sortRoom()
  }
  else {
    this.tick();
  }
}
SorterMan.prototype.checkRoadToSource = function(){
  /*for(let i in this.memory.sourceNodes){
    if(!this.memory.sourceNodes[i].toBuild.Road) {

    }
  }
*/
}
