
Creep.prototype.deliver = function(container) {
  if (container != undefined) {
    if (this.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.travelTo(container)
    }
  }
}


Creep.prototype.findDeliveryTarget = function() {
  if (this.room.name == this.memory.home) {
    let target = null;
    let container = null;
    let temp2 = [];
    if (this.room.energyAvailable != this.room.energyCapacityAvailable) {
      container = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
            s.structureType == STRUCTURE_EXTENSION) &&
          s.energy < s.energyCapacity
      });
    } else if (this.room.energyAvailable == this.room.energyCapacityAvailable) {
      let temp1 = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
          s.store[RESOURCE_ENERGY] != s.storeCapacity

      });
      for (var i = 0; i < this.room.memory.structureIDs.Containers.length; i++) {
        if (this.room.memory.structureIDs.Containers[i] == temp1.id) {
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
    if (target != null) {
      this.deliver(Game.getObjectById(target.id));
    }
  } else if (this.room.name != this.memory.home) {

  }
};

/** @function
    @param {bool} getFromContainer
    @param {bool} getFromSource */
Creep.prototype.getEnergy = function(getFromContainer, getFromSource) {
  /**  @type {STRUCTURE_CONTAINER} **/
  let container;

  if (getFromContainer == true) {
    container = this.room.findMostFullContainer()
  }
  if (container != undefined) {
    if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.travelTo(container);
    }
  }

  // if no container was found
  if (container == null && getFromSource == true) {
    var sources = _.sortBy(this.sourceNodes, s => this.pos.getRangeTo(s))
    var source = sources[0]
    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.travelTo(source);
    }
  }
}


Creep.prototype.checkDeath = function(creep) {
  if (this.ticksToLive < 20) {
    console.log("------------")
    console.log("Hey there " + this.memory.type + ", " + this.name + " is dying.");
    console.log("-----This was a CheckDeath Function-------")
  }
}
