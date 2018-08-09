var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer'),
  claimer: require('role.claimer'),
  miner: require('role.miner')
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


Creep.prototype.roleHarvester = function(creep) {
  let source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (this.harvest(source) == ERR_NOT_IN_RANGE) {
    // move towards the source
    this.ourPath(source)
  }
};

Creep.prototype.roleBuilder = function(creep) {

  /*  var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
     if(targets.length) {
        targets.sort(function(a,b){
          return a.progress > b.progress ? -1 : 1});
           if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
             creep.ourPath(targets[0]); }*/


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
  } else {
    roles.builder.run(creep);
  }
}

Creep.prototype.Deliver = function(container) {
  if (container != undefined) {
    if (this.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.ourPath(container)
    }
  }
}


Creep.prototype.energyDeliver = function(creep) {
    let container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
        s.structureType == STRUCTURE_EXTENSION) &&
      s.energy < s.energyCapacity
  });
  if (container == null) {
     container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER) &&
        s.store[RESOURCE_ENERGY] > 0
    })
  }
  else if (container == null) {
   this.roleBuilder(this)
  }
  this.Deliver(container);
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
        s.store[RESOURCE_ENERGY] > 0
    });
    if (container != undefined) {
      if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(container);
      }
    }
  }
  // if no container was found
  if (container == null && getFromSource == true) {
    var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.moveTo(source);
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
