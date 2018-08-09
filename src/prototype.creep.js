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
  const path = this.pos.findPathTo(destination);
  this.memory.path = path;
  Memory.path = Room.serializePath(path);
  this.moveByPath(Memory.path)
}

Creep.prototype.roleBuilder = function(creep) {
  var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
  // Sort construction sites by progress.
  targets.sort(function(a, b) {
    return b.progress - a.progress;
  })
  if (targets.length) {
    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
      creep.ourPath(targets[0])
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


Creep.prototype.findDeliveryTarget = function(creep) {
  let container = null;
  if(creep.room.energyAvailable != creep.room.energyCapacity){
     container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
        s.structureType == STRUCTURE_EXTENSION) &&
      s.energy < s.energyCapacity
  });
}
 if(container == null) {
     container = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
    })
    container.sort(function(a, b) {
      return a.store.energy - b.store.energy
    })
    console.log(container[0].store.energy)
    this.deliver(container[0]);

}

   /*if (container == null) {
     console.log("Nowhere to deliver time to build")
   this.roleBuilder(this)
 }else{
  this.deliver(container);
}*/
};

/** @function
    @param {bool} getFromContainer
    @param {bool} getFromSource */
Creep.prototype.getEnergy = function(getFromContainer, getFromSource) {
  /**  @type {STRUCTURE_CONTAINER} **/
  let container;
  if (getFromContainer == true) {
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > 250
    });
    if (container != undefined) {
      if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.ourPath(container);
      }
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
