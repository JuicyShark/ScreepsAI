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
  const path = this.pos.findPathTo(destination);
  let tempName = destination.id;
  let temp1 = {
    [destination.structureType]: {
      [destination.id]: path
    }
  };
  this.memory.paths = temp1;
  this.memory.paths.myPath = path
  }

  this.moveByPath(this.memory.paths.myPath)
  }



Creep.prototype.roleBuilder = function(creep) {
  var targets = this.room.memory.constructionSites
  if (_.size(targets) >= 1) {

    var thisTarget = Game.getObjectById(targets[0]);

  }
  else if (_.size(targets) == 0) {
    console.log("Builder no build D:")
  }
  if (thisTarget != null) {
    if (creep.build(thisTarget) == ERR_NOT_IN_RANGE) {
      creep.ourPath(thisTarget)
    }
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
  let container = null;
  if(this.room.energyAvailable != this.room.energyCapacityAvailable){
     container = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
        s.structureType == STRUCTURE_EXTENSION) &&
      s.energy < s.energyCapacity
  });
}
 if(container == null) {
     container = this.room.find(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
    })
  }

this.deliver(container);
};

/** @function
    @param {bool} getFromContainer
    @param {bool} getFromSource */
Creep.prototype.getEnergy = function(getFromContainer, getFromSource) {
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
    if (droppedEnergy.length != 0) {
      this.pickup(droppedEnergy.pop())
    }

  if (getFromContainer == true) {
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > 250
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
