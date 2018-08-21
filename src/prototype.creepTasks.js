
Creep.prototype.checkForTask = function() {
  let task = this.memory.task
  if (task != null) {
    return true;
  }else{
    return false
  }
}

Creep.prototype.runTask = function() {
  if(this.checkForTask() == true){
    if(this.memory.task.name == "HARVEST") {
      this.harvestTask()
    }
    if(this.memory.task.name == "BUILD") {
      this.buildTask()
    }
    if(this.memory.task.name == "UPGRADE") {
      this.upgradeTask();
    }
    if(this.memory.task.name == "REPAIR") {
      this.repairTask();
    }

  } else {
  }
}
