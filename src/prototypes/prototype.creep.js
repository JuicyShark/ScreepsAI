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
    }

  Creep.prototype.harvest =
  function(creep) {
    let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    // try to harvest energy, if the source is not in range
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // move towards the source
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
    }

  }

  Creep.prototype.energyDeliver =
    function(creep) {

      if ()


      let container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (s) => (s.structureType == STRUCTURE_SPAWN
              || s.structureType == STRICTURE_STORAGE
              || s.structureType == STRUCTURE_EXTENSION
              || s.structureType == STRUCTURE_TOWER)
              && s.energy < s.energyCapacity
      });

      if (container == undefined) {
          container = creep.room.storage;
      }

      // if one was found
      if (container != undefined) {
          // try to withdraw energy, if the container is not in range
          if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              // move towards it
              creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
          }
      }

    }




var roles = {
    harvester: require('../roles/harvester.js'),
    upgrader: require('../roles/upgrader.js'),
    builder: require('../roles/builder.js'),
};

  Creep.prototype.runRole =
      function () {
          roles[this.memory.role].run(this);
      };
