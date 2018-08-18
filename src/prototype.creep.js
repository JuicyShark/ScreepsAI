var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer'),
  claimer: require('role.claimer'),
  miner: require('role.miner'),
  lorry: require('role.lorry')
}

Creep.prototype.runRole = function() {
  roles[this.memory.role].run(this);
};

Creep.prototype.ourPath = function(destination) {

    if (Game.time % 4 === 0) {
      //console.log("RESET TIME")
      delete this.memory.paths
    }
    if (!this.memory.paths) {
    var path = this.pos.findPathTo(destination, {serialize: true});
    /*let tempName = destination.id;
    let temp1 = {
      [destination.structureType]: {
        [destination.id]: path
      }
    };*/
    this.memory.paths = {};
    this.memory.paths.myPath = path;
    }


  this.moveByPath(this.memory.paths.myPath)
  }



Creep.prototype.roleBuilder = function() {

  var task = this.memory.tasks[0]
  if(task != null){
    var thisTarget = Game.getObjectById(task.details.target);

  if (thisTarget != null) {
    if (this.build(thisTarget) == ERR_NOT_IN_RANGE) {
      this.ourPath(thisTarget)
    }
  }
  }else{
      console.log("no current tasks")
  }
};

Creep.prototype.roleRepairer = function(creep) {
  var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
  });
  if (structure == undefined) {
    structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_WALL ||
        s.structureType == STRUCTURE_CONTAINER ||
        s.structureType == STRUCTURE_EXTENSION
    });
  }
  if (creep.repair(structure) == ERR_NOT_IN_RANGE && structure != undefined) {
    this.ourPath(structure);
  }
}

Creep.prototype.deliver = function(container) {
  if (container != undefined) {
    if (this.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.ourPath(container)
    }
  }
}


Creep.prototype.findDeliveryTarget = function(oldTarget) {
  let target = null;
  let container = null;
  if(this.room.energyAvailable != this.room.energyCapacityAvailable){
     container = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
        s.structureType == STRUCTURE_EXTENSION) &&
      s.energy < s.energyCapacity
  });
} else if (this.room.energyAvailable == this.room.energyCapacityAvailable) {
  let temp1 = this.pos.findClosestByPath(FIND_STRUCTURES, {
 filter: (s) => (s.structureType == STRUCTURE_CONTAINER) &&
   s.store != s.energyCapacity
});
    let temp2 = [];
    for(let i in this.room.memory.structureIDs.Containers) {
    if (this.room.memory.structureIDs.Containers[i] == temp1.id){
      temp2.push(temp1)
    }
  }
  container = temp2[0]
}
target = container;
this.deliver(target);
};

/** @function
    @param {bool} getFromContainer
    @param {bool} getFromSource */
Creep.prototype.getEnergy = function(getFromContainer, getFromSource) {
  var config = require("config")
  /**  @type {STRUCTURE_CONTAINER} **/
  let container;
  var miner = this.room.find(FIND_MY_CREEPS, {
    filter: {memory: {role: "miner"} }
});

  /*var fullMiner = miner[0].getActiveBodyparts(WORK)
    if (fullMiner == 5) {
      getFromSource = false;
    } else {

    }*/
    let droppedEnergy = this.pos.findInRange(FIND_DROPPED_RESOURCES, 2)
    if (droppedEnergy != null) {
    this.pickup(droppedEnergy[0])
    }

  if (getFromContainer == true) {
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > config.containerGetEnergyLevels[this.room.level()]
    });
  }
    if (container != undefined) {
      if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.ourPath(container);
        this.memory.oldTarget == container
      }
    }

  // if no container was found
  if (container == null && getFromSource == true) {
    var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.ourPath(source);
    }
  }

}
Creep.prototype.checkDeath = function(creep) {
  if (creep.ticksToLive < 25) {
    if (Game.time % 15 === 0) {
      console.log("------------")
      console.log("Hey there a " + creep.memory.role + ", " + creep.name + " is dying.");
      console.log("-----This was a CheckDeath Function-------")
    }
  }
};
