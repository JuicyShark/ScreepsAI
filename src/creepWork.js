  module.exports.energyCollection =
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
    },

  module.exports.harvest =
  function(creep) {
    let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    // try to harvest energy, if the source is not in range
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // move towards the source
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
    }


  },

  module.exports.energyDeliver =
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
              /*|| s.structureType == STRICTURE_EXTENSION*/
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

    }
