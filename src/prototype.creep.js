
Creep.prototype.energyCollection =
  function(creep)  {
      let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      });

      if (container == undefined) {
          container = creep.room.storage;
      }

      // if one was found
      if (container != undefined) {
      // try to withdraw energy, if the container is not in range
      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              // move towards it
              creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
          }
      }
  };

Creep.prototype.harvester =
function(creep) {
  let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  // try to harvest energy, if the source is not in range
  if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      // move towards the source
      creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
  }
};

Creep.prototype.energyDeliver =
  function(creep) {

    var deliver = function(container) {
      if (container != undefined) {
          if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
          }
      }
    }

    if (creep.memory.role != "Upgrader") {

    let container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN
            || s.structureType == STRUCTURE_CONTROLLER)
            && s.energy < s.energyCapacity
    });
    deliver(container);
  }
  else {
    let container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_CONTROLLER
            || s.structureType == STRICTURE_SPAWN)
            && s.energy < s.energyCapacity
          });
    deliver(container);
    }
  };

Creep.prototype.building =
        function(creep) {

          let buildingSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
          if (creep.build(buildingSite) == ERR_NOT_IN_RANGE) {
          const path = creep.pos.findPathTo(buildingSite);
          creep.memory.path = path;
          Memory.path = Room.serializePath(path);
          creep.moveByPath(Memory.path)
  }
};

Creep.prototype.checkDeath =
  function (creep) {

    let life = creep.ticksToLive;
    let source = creep.pos.findClosestByPath(STRUCTURE_SPAWN);

    if(life < 25) {
    creep.energyDeliver(creep)  
    }
    if (life < 19 && life > 10) {
        creep.say(creep.name, ": This is a dark tunnel" )
      //possible add a rejuvination thingy here for the creeps

    }
    else if (life < 9 && life > 1) {
        creep.say(creep.name, ": I can see the Light!")

    }

  };

 Creep.prototype.runRole =
        function() {
          let upgrader = require("role.upgrader")
          let harvester = require("role.harvester")
          let builder = require("role.builder")


          if (this.memory.role == "harvester"){
            if (this.memory.role == "harvester"){
              harvester.run(this);
            }
          }
          if (this.memory.role == "upgrader"){
            if (this.memory.role == "upgrader"){
              upgrader.run(this);
            }
          }
          if (this.memory.role == "builder"){
            if (this.memory.role == "builder"){
              builder.run(this);
            }
          }
        };
