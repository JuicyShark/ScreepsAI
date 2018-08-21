
Creep.prototype.checkForTask = function() {
  let task = this.memory.task
  if(task.length == 0) {
    return false;
  } else if (task.length >= 1 && task[0] != null) {
    return true;
  }
}

Creep.prototype.runTask = function() {
  if(this.checkForTask() == true){
    if(this.memory.task[0].name == "HARVEST") {
      this.harvestTask()
    }
    if(this.memory.task[0].name == "BUILD") {
      this.buildTask()
    }
    if(this.memory.task[0].name == "UPGRADE") {
      this.upgradeTask();
    }
    if(this.memory.task[0].name == "REPAIR") {
      this.repairTask();
    }

  } else {
  }
}
