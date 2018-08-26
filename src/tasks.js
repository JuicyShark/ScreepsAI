
var tasks = {

  upgradeTask: function(creep) {
    creep.checkDeath();
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = "true";
    }
    if (creep.carry.energy == 0) {
      creep.memory.working = "false";
    }
    if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "false") {
      creep.getEnergy(true, true)
    }
    if (creep.carryCapacity != 0 && creep.memory.working == "true") {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.travelTo(creep.room.controller);
      }
    }
  },

  repairTask: function(creep) {
    creep.checkDeath(creep)

    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = "true";
    }
    if (creep.memory.working == "false") {
      creep.getEnergy(true, true)
    }
    if (creep.carry.energy == 0) {
      creep.memory.working = "false";
    }
    if (creep.carry.energy != 0 && creep.memory.working == "true") {
      var structure = Game.getObjectById(creep.memory.task.details.target);
      if (structure.needsRepair() == false || structure.needsRepair() == null) {
        creep.shakeTask();
      }
      else if (creep.repair(structure) == ERR_NOT_IN_RANGE && structure != undefined) {
        creep.travelTo(structure);
      }

    }
  },

  harvestTask: function(creep) {

    creep.checkDeath();
    var taskSource = Game.getObjectById(creep.memory.task.details.target)
    if (creep.carry.energy == 0) {
      creep.memory.working = "true";
    }
    if (creep.memory.working == "false") {
      creep.findDeliveryTarget()
    }
    if (creep.carry.energy != creep.carryCapacity && creep.memory.working == "true") {
      if(creep.harvest(taskSource) == ERR_NOT_IN_RANGE) {
        creep.travelTo(taskSource)
      }
     } else if (creep.carry.energy == creep.carryCapacity && creep.memory.working == "true") {
      creep.memory.working = "false"
    }

},

  buildTask: function (creep) {
    creep.checkDeath();
    if (creep.memory.working == "false") {
      creep.getEnergy(true, true)
    } else if (creep.memory.working == "true") {
      var  creepTask = creep.memory.task.details.target
        var creepTarget = Game.getObjectById(creepTask);

      if (creepTarget != null) {
        if (creep.build(creepTarget) == ERR_NOT_IN_RANGE) {
          creep.travelTo(creepTarget)
        }
      } else{
        console.log(creep.name + ", Target is nowhere to be found. Removing task");
        creep.shakeTask();
      }
    }
    if (creep.carry.energy == creep.carryCapacity && creep.memory.working == "false") {
     creep.memory.working = "true";
   } else if (creep.carry.energy == 0 && creep.memory.working == "true"){
     creep.memory.working = "false";
   }
 },

 lorryTask: function (creep) {
   creep.checkDeath(creep)
if(creep.memory.task != null || creep.memory.task != undefined){
  let container = creep.memory.task.details.target
   if (creep.memory.working == "false") {
     creep.containerCollection()
   }
   if (creep.carry.energy == creep.carryCapacity && creep.memory.working == "false") {
     creep.memory.working = "true";
   }
   if (creep.carry.energy == 0 && creep.memory.working == "true") {
     creep.memory.working = "false";
   }
   if (creep.memory.working == "true") {
     creep.findDeliveryTarget()
   }
 }
 },

 minerTask: function (creep) {
   creep.checkDeath(creep)

   if(creep.memory.task != null || creep.memory.task != undefined){
     let container = creep.memory.task.details.target
     let sourceId = creep.memory.task.details.sourceId
     var source = Game.getObjectById(sourceId)
     var thisContainer = Game.getObjectById(container);

     if (thisContainer != null) {
       if(creep.pos != thisContainer.pos) {
         creep.travelTo(thisContainer)
       }
       if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
         creep.travelTo(thisContainer)
       }
     }
   }
 },

 attackTask: function (creep) {
   creep.checkDeath();
   if(creep.memory.working == "false") {
     var  creepTask = creep.memory.task.details.target

   } else if (creep.memory.working == "true"){

   }
 }

}


module.exports = tasks;
