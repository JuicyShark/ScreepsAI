module.exports = {
  defaultMem: {
    colonyMem: {
      bases: {},
      outpost: {},
      otherRooms: {},
      enemys: {}
      },
    allies: {
      username: "Juicy-shark",
      username: "CrazedGod"
    },

    RoomStructureMem: {
      controller : {
        id: "",
        taskInit: false,
        toBuild: {
          Road: true
        }
      },
      Containers: [],
      Extensions: [],
      Spawns : [],
      Towers: [],
      Roads: [],
      needsRepair: []
    },

    creepTypes : {
      allRound: {
        creeps: [],
        type: "ALL_ROUND"
      },
      containerMiner: {
        creeps: [],
        type: "CONTAINER_MINER"
      },
      upgrader: {
        creeps: [],
        type: "UPGRADER"
      },
      lorry:  {
        creeps: [],
        type: "LORRY"
      },
      claimer:  {
        creeps: [],
        type: "CLAIMER"
      },
      attacker: {
        creeps: [],
        type: "ATTACKER"
      },
      defender: {
        creeps: [],
        type: "DEFENDER"
      }
    }
  },
  taskPriorities: {
    constructionSites: {
      storage: 1,
      container: 3,
      tower: 5,
      extension: 5,
      road: 6
    }
  },
  buildingLevels: {
    sources: {
      Road: true,
      Container: true
    }
  },
  wallHitpoints: {
    1: 1,
    2: 10,
    3: 50
  },
  rampartHitpoints: {
    1: 1,
    2: 9,
    3: 49
  },
  bodies: {
    claimer: [CLAIM, MOVE, MOVE],
    default: [WORK, CARRY, MOVE],
    allRounder : {
      bodyReturn: function(energyCap){
        if(energyCap > 450) {
          return 350
        } else {
          return energyCap
        }
      },
      defaults: {
        300: [WORK, WORK, CARRY, MOVE],
        350: [WORK, WORK, CARRY, CARRY, MOVE],
        400: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        450: [MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK],
        500: [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK]
      }
    },
    miner: {
      bodyReturn: function(energyCap) {
        if(energyCap > 500) {
          return 500
        } else {
          return energyCap
        }
      },
        defaults: {
        300: [WORK, WORK, MOVE],
        350: [WORK, WORK, MOVE],
        400: [WORK, WORK, MOVE],
        450: [WORK, WORK, MOVE],
        500: [WORK, WORK, WORK, WORK, MOVE],
        550: [WORK, WORK, WORK, WORK, WORK, MOVE],
        600: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
        650: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
        700: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
        750: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
      }
      },
     lorry: {
        bodyReturn: function(energyCap) {
          if(energyCap > 450) {
           return 400
          } else {
            return energyCap
          }
        },
        defaults: {
          300: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
          350: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
          400: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
          450: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
          500: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
          550: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
          600: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
      },
     upgrader: {
       bodyReturn: function(energyCap) {
          if(energyCap > 500) {
           return 500
          } else {
            return energyCap
          }
        },
        defaults: {
          300: [CARRY, CARRY, WORK, MOVE, MOVE],
          350: [CARRY, CARRY, WORK, WORK, MOVE],
          400: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, ],
          450: [CARRY, CARRY, WORK, WORK, WORK, MOVE,],
          500: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE]
        }
      },

     defender: function(energy) {
       let outputArray = [];
       let numberOfParts = Math.floor(energy / 200);
       var body = [];

       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(MOVE);
         outputArray.push(MOVE);
       }
       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(ATTACK);
       }
       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(TOUGH);
         outputArray.push(TOUGH);
       }
       return outputArray
     },

     rangedAttacker: function(energy) {
       let outputArray = [];
       let numberOfParts = Math.floor(energy / 200);
       var body = [];

       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(MOVE);
       }
       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(RANGED_ATTACK);
       }

       return outputArray
     },
     brawler: function(energy) {
       let outputArray = [];
       let numberOfParts = Math.floor(energy / 200);
       var body = [];

       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(MOVE);
         outputArray.push(MOVE);
       }
       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(ATTACK);
       }
       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(TOUGH);
         outputArray.push(TOUGH);
       }
       return outputArray
     },
     medic: function(energy) {
       let outputArray = [];
       let numberOfParts = Math.floor(energy / 300);
       var body = [];

       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(MOVE);
       }
       for (let i = 0; i < numberOfParts; i++) {
         outputArray.push(HEAL);
       }
       return outputArray
     }
  },
  defaultLogs: {
    EnemyInRoom: "There was an Enemy in the room! ",
    SafeModeActivate: "SafeMode Activated"
  },

  //need to be moved to defuat mem
  attackFlagMemory: {
    name: "",
    room: "",
    attackOrders: {
      targetRoom: "",
      idleFlagID: "",
      creeps: []
    },
  idleFlagMemory: {
    name: "",
    room: "",
    attackFlagID: "",
    creeps: []
  }

  },
containerGetEnergyLevels: {
    1: 200,
    2: 400,
    3: 600,
    4: 800,
    5: 800,
    6: 800,
    7: 800,
    8: 1000
  }

}
