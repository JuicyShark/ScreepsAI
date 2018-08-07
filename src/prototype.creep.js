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



   Creep.prototype.runRole =
        function() {
          let upgrader = require("role.upgrader")
          let harvester = require("role.harvester")
          let builder = require("role.builder")


          if (this.memory.role == "Harvester"){
            if (this.memory.role == "Harvester"){
              harvester.run(this);
            }
          }
          if (this.memory.role == "Upgrader"){
            if (this.memory.role == "Upgrader"){
              upgrader.run(this);
            }
          }
          if (this.memory.role == "Builder"){
            if (this.memory.role == "Builder"){
              builder.run(this);
            }
          }
          /*

          if (this.memory.role == "Upgrader"){
            upgrader.run(this)
          }*/

            //roles[this.memory.role].run(this);
        };
