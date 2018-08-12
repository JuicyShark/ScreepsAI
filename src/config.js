module.exports = {
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
    repairer: ''
  },
  maxMiners: {
    1: 0,
    2: 0,
    3: 0
  },
  maxUpgraders: {
    1: 1,
    2: 1,
    3: 2
  },
  maxBuilders: {
    1: 1,
    2: 1,
    3: 2
  },
  maxRepairers: {
    1: 1,
    2: 1,
    3: 2,
    4: 3
  },
  maxLorrys: {
    1: 0,
    2: 0,
    3: 1
  },
  bodies: {
    claimer: [CLAIM, CLAIM, MOVE, MOVE],
    default: [WORK, CARRY, MOVE],
    harvester : {
      300: [WORK, WORK, CARRY, MOVE],
      350: [WORK, WORK, CARRY, CARRY, MOVE],
      400: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      450: [MOVE, MOVE, CARRY, CARRY, WORK, WORK],
      500: [],
      550: []
    },
    miner: {
       300: [WORK, WORK, MOVE],
       350: [WORK, WORK, MOVE],
       400: [WORK, WORK, MOVE],
       450: [WORK, WORK, MOVE],
       500: [WORK, WORK, WORK, MOVE],
       550: [WORK, WORK, WORK, WORK, WORK, MOVE]
     },
     lorry: {
       300: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
       350: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
       400: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
       450: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
       500: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
       550: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
       600: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
     },
     upgrader: {
       300: [CARRY, CARRY, WORK, MOVE, MOVE],
       350: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
       400: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
       450: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
       500: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
       550: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
       600: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
       650: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
       700: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE]
     },

     builder: {
       300: [CARRY, CARRY, WORK, MOVE, MOVE],
       400: [CARRY, CARRY, WORK, WORK, MOVE, MOVE]
     },

     repairer: {
       300: [CARRY, CARRY, WORK, MOVE, MOVE],
       400: [CARRY, CARRY, WORK, WORK, MOVE, MOVE]
     },



     defender: {

     },

     attacker: {

     }
  }

}
