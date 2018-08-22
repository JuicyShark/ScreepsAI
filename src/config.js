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
      Roads: []
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
  roleList: {
    harvester: '',
    miner: '',
    builder: '',
    lorry: '',
    upgrader: '',
    repairer: '',
    roomPopulation: ''
  },
  maxUpgraders: {
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 3,
    7: 3,
    8: 3
  },
  maxBuilders: {
    1: 1,
    2: 1,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  maxRepairers: {
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  maxLorrys: {
    1: 0,
    2: 0,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  bodies: {
    claimer: [CLAIM, MOVE, MOVE],
    default: [WORK, CARRY, MOVE],
    allRounder : {
      bodyReturn: function(energyCap){
        if(energyCap > 500) {
          return 500
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
          if(energyCap > 600) {
           return 600
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
