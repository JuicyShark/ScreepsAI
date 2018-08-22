


Creep.prototype.ourPath = function(destination) {
    var path = this.pos.findPathTo(destination, {serialize: true});
    if (Game.time % 4 === 0) {
      delete this.memory.paths
    }
    if (!this.memory.paths) {
    this.memory.path = path;
    }
  this.moveByPath(this.memory.path)
  }

Creep.prototype.deliver = function(container) {
  if (container != undefined) {
    if (this.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.ourPath(container)
    }
  }
}


Creep.prototype.findDeliveryTarget = function() {
if(this.room.name == this.memory.home) {
  let target = null;
  let container = null;
  let temp2 = [];
  if(this.room.energyAvailable != this.room.energyCapacityAvailable){
     container = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
        s.structureType == STRUCTURE_EXTENSION ) &&
      s.energy < s.energyCapacity
  });
} else if (this.room.energyAvailable == this.room.energyCapacityAvailable) {
  let temp1 = this.pos.findClosestByPath(FIND_STRUCTURES, {
 filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
              s.store[RESOURCE_ENERGY] != s.storeCapacity

});


    for(let i in this.room.memory.structureIDs.Containers) {
    if (this.room.memory.structureIDs.Containers[i] == temp1.id){
      temp2.push(temp1)

    }
  }
  let container = temp2[0]
  }
  if (!container) {
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_TOWER &&
      s.energy < s.energyCapacity
    })
  }

target = container;
if(target != null){
this.deliver(Game.getObjectById(target.id));
}
}
else if (this.room.name != this.memory.home) {
  //console.log(this)
}

//console.log(container.id)

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
  if (this.ticksToLive < 20) {
    if(this.ticksToLive < 5) {

      console.log("------------")
      console.log("Hey there " + creep.memory.type + ", " + creep.name + " is dying.");
      console.log("-----This was a CheckDeath Function-------")
    }
  }
}
