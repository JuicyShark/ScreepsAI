Creep.prototype.energyCollection =
  function(creep)  {

      let collectEnergy = function(creep, i) {
        if (creep.withdraw(i, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(i, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else {
          //console.log(i)
          creep.withdraw(i, RESOURCE_ENERGY)
        }

      }
      let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      });

      if (container == undefined) {
          let nextContainer = creep.room.storage;
      if (nextContainer != null){
        collectEnergy(creep, newContainer)
      }
      else if (nextContainer == null){
        let lastResort = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_SPAWN && s.energy > 299
        });

        if (lastResort != null) {
        collectEnergy(creep, lastResort)
        }
        else if (lastResort == null) {
          //here is where we can turn them into upgraders?
        }
      }
      // if one was found
    }
      if (container != undefined) {

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

      if (container != null) {
        deliver(container);
      }
      else {
        this.building(this)
      }


  }
  else {
    let container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN
            || s.structureType == STRUCTURE_EXTENSION)
            && s.energy < s.energyCapacity
          });
    deliver(container);
    }
  };



Creep.prototype.checkDeath =
  function (creep) {

    let life = creep.ticksToLive;
    //let source = creep.pos.findClosestByPath(STRUCTURE_SPAWN);

    if(life < 25) {
        if (Game.time % 5 === 0){
        console.log("------------")
        console.log("Hey there a"+ creep.memory.role +", "+ creep.name+ " is dying.")
        console.log("-----This was a CheckDeath Function-------")
      }
    this.energyDeliver(creep)

    }
    if (life < 19 && creep.life > 10) {
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
