var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer')
}

Creep.prototype.runRole =  function() {
    roles[this.memory.role].run(this);
  };

  Creep.prototype.ourPath = function(destination){
    const path = this.pos.findPathTo(destination);
    this.memory.path = path;
    Memory.path = Room.serializePath(path);
    this.moveByPath(Memory.path)
  }

  Creep.prototype.roleContainerMiner =  function(creep) {
      let closeSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      source = Game.getObjectById(closeSource.id);
    source.memory = this.room.memory.sourceNodes[source.id]
      let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER
      })[0]
      // try to harvest energy, if the source is not in range
      if (this.pos.isEqualTo(container.pos)) {
        source.memory.workers = +1
        this.harvest(source)
      }else{
        this.moveTo(container)
      }
    };


Creep.prototype.roleHarvester =  function(creep) {
    let source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    // try to harvest energy, if the source is not in range
    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
      // move towards the source
      this.ourPath(source)
    }
  };

Creep.prototype.roleBuilder =  function(creep) {

    let buildingSite = this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    if (this.build(buildingSite) == ERR_NOT_IN_RANGE) {
      this.ourPath(buildingSite)
    }
/*    if (buildingSite == undefined) {
      var target = Memory.outposts[Object.keys(Memory.outposts)[0]]
      this.ourPath(target);
    } */
  };

Creep.prototype.roleRepairer =  function(creep) {
    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
    });
    if (structure == undefined) {
      structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_WALL
      });
    }
    if (creep.repair(structure) == ERR_NOT_IN_RANGE && structure != undefined) {
      creep.moveTo(structure);
    } else {
      roles.builder.run(creep);
    }
  }
Creep.prototype.Deliver = function(container){
  console.log(this + " Wants to deliver to: "+ container)
  if (container != null) {
    if (this.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.ourPath(container)
    }
  }//else{console.log(this +" was unable to Deliver")     Calls once even if delivered successfully or repeatedly if everything is full
}


Creep.prototype.energyDeliver =  function(creep) {
  // this = creep selected
      let container =  this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER) &&
            s.store[RESOURCE_ENERGY] > 0
          })
        if (container == null) {
          container =  this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
              s.structureType == STRUCTURE_EXTENSION) &&
            s.energy < s.energyCapacity

        });
      }
     if(container != null){
      return this.Deliver(container);
    }else{
          this.roleBuilder(this)
        }
      };

      Creep.prototype.collectEnergy = function(creep, i) {
        console.log(this+ " Is collecting from: "+ i)
          if (this.withdraw(i, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.ourPath(i)
          } else {
            this.withdraw(i, RESOURCE_ENERGY)
          }
      }

      Creep.prototype.energyCollection =  function(creep) {
          let container =  this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
          });
              if(container != null){
              this.collectEnergy(this, container)
            } else {
              this.roleHarvester(this)
            }
          }

          Creep.prototype.checkDeath = function(creep) {
              if (creep.ticksToLive < 25) {
                if (Game.time % 15 === 0) {
                  console.log("------------")
                  console.log("Hey there a " + creep.memory.role + ", " + creep.name + " is dying.");
                  console.log("-----This was a CheckDeath Function-------")
                }
                this.energyDeliver(creep);
              }
            };
