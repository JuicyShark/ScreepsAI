global.brain = {
  stats: {},
  main: {},
};

global.config = {
  profiler: {
    enabled: true
  }
}
/**
 * Your username - you shouldn't need to change this.
 */
function getUsername(): string {
  for (let i in Game.rooms) {
    let room = Game.rooms[i];
    if (room.controller && room.controller.my) {
      return room.controller.owner.username;
    }
  }
  console.log('ERROR: Could not determine username.');
  return 'ERROR: Could not determine username.';
}

export const MY_USERNAME: string = getUsername();
export function MY_ALLY(): string {
  let Team: string[] = [
    "Juicy-Shark",
    "CrazedGod"
  ]
  let MY_ALLY: string;
  Team.forEach(function (usr) {
    if (usr != MY_USERNAME) {
      MY_ALLY = usr;
    }
  })
  return MY_ALLY
}
//CPU BUCKET LIMITS
export const minBucket: number = 3000;
export const safeBucketLimit: number = 8000;

//COLONIES STRUCTURE SETUP
export function defaultColoniesMem(): Object {
  function roomSpawnIDs(roomSpawns: StructureSpawn[]) {
    let output: any = [];
    roomSpawns.forEach(spawn => { output.push(spawn.id) })
    return output;
  }
  let myRooms, controllerLevel;
  for (const i in Game.rooms) {
    let room = Game.rooms[i]
    let roomName: string = room.name
    if (room.controller != undefined && room.my === true && room.spawns != undefined) {
      controllerLevel = room.controller.level;
    }
    myRooms = {
      [roomName]: {
        spawns: roomSpawnIDs(room.spawns),
        RoomLevel: controllerLevel,
        outposts: room.memory.outposts
      }
    }
  }
  return {
    ColonySize: 1,
    ColonyRooms: myRooms
  }
}

export var creepTypes: string[] = [
  "GeneralHand",
  "Builder",
  "Upgrader",
  "Miner",
  "Lorry",
  "Patroller",
  "Defender",
  "Attacker",
  "Scout"
]
export const tempGeneralCreepsMAX = {
  1: 5,
  2: 5,
  3: 5,
  4: 4,
  5: 3,
  6: 3,
  7: 3,
  8: 3
}
export function creepPriority(type: string): number {
  let temp = [
    {
      type: "GeneralHand",
      priority: 3
    },
    {
      type: "Builder",
      priority: 4
    },
    {
      type: "Upgrader",
      priority: 4
    },
    {
      type: "Miner",
      priority: 2
    },
    {
      type: "Lorry",
      priority: 4
    },
    {
      type: "Patroller",
      priority: 2
    },
    {
      type: "Defender",
      priority: 2
    },
    {
      type: "Attacker",
      priority: 2
    },
    {
      type: "Scout",
      priority: 3
    }
  ]

  if (type != undefined) {
    let output: number | null = null;
    temp.forEach(function (value: { type: string; priority: number; }, index: number) {
      if (value.type == type) {
        output = value.priority
      }

    })
    if (output != null) {
      return output
    }
  }
}

export var roomTypes: string[] = [
  //Colony RoomTypes
  "ColonyHub",
  "Basic",
  "Spawner",
  "Highway",
  "Outpost",
  //Other Room Types
  "Enemy_Base",
  "Enemy_Outpost",
  "Ally_Base",
  "Ally_Outpost",
  "SKRoom"
]


function createBody(type: string, room: Room): string[] {
  var energy = room.energyCapacityAvailable
  if (room.creeps.length <= 5) {
    if (room.energyAvailable > (room.energyCapacityAvailable - room.energyAvailable)) {
      energy = room.energyAvailable
    }
    else {
      energy = 300;
    }
  }
  else {
    energy = room.energyCapacityAvailable;
  }
  //creating a balanced body
  if (type == "GeneralHand" || type == "Upgrader" || type == "Builder") {
    var numberOfParts = Math.floor(energy / 200);
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    var body: string[] = [];
    for (let i = 0; i < numberOfParts; i++) {
      body.push("work");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("carry");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("move");
    }
    return body;
  }

  if (type == "Miner") {
    let bodyReturn = function (energy): number {
      if (energy <= 500) {
        return 300
      } else if (energy >= 750) {
        return 750
      } else {
        return energy
      }
    }
    let Minerdefaults = {
      300: [WORK, WORK, MOVE],
      500: [WORK, WORK, WORK, WORK, MOVE],
      550: [WORK, WORK, WORK, WORK, WORK, MOVE],
      600: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
      650: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
      700: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
      750: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
    }

    body = Minerdefaults[bodyReturn(energy)]

    return body;
  }
  if (type == "Scout") {
    body = ["move"]
    return body;
  }
  if (type == "Patroller") {
    if (energy >= 300) {
      energy = 300
    }
    var numberOfParts = Math.floor(energy / 150);
    var body: string[] = [];
    for (let i = 0; i < numberOfParts; i++) {
      body.push("move");
    }
    numberOfParts = Math.floor(energy / 150)
    for (let i = 0; i < numberOfParts; i++) {
      body.push("attack");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }
    return body;

  }
  if (type == "Lorry") {
    var numberOfParts = Math.floor(energy / 100);
    numberOfParts = Math.min(numberOfParts, Math.floor(100 / 2));
    for (let i = 0; i < numberOfParts; i++) {
      body.push("carry");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("move");
    }
    return body;

  }
  if (type == "Attacker") {
    var numberOfParts = Math.floor(energy / 200);
    var body: string[] = [];
    for (let i = 0; i < numberOfParts; i++) {
      body.push("move");
    }
    numberOfParts = Math.floor(energy / 200)
    for (let i = 0; i < numberOfParts; i++) {
      body.push("attack");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("ranged_attack");
    }
    return body;

  }
  if (type == "Defender") {
    var numberOfParts = Math.floor(energy / 200);
    var body: string[] = [];
    for (let i = 0; i < numberOfParts; i++) {
      body.push("move");
    }
    numberOfParts = Math.floor(energy / 200)
    for (let i = 0; i < numberOfParts; i++) {
      body.push("attack");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("ranged_attack");
    }
    return body;

  }
}


export function creepBodySizes(type: string, room: Room): string[] {
  var output: string[];
  creepTypes.forEach(function (creepType: string, index: number) {
    if (creepType == type) {
      output = createBody(creepType, room)
    }
  })

  if (output != undefined) {
    return output
  }
  else {
    return ["move", "move", "work", "carry"]
  }
}

export function configCreepTypes(type: string): string {
  let creepTypeSelected: string = "";
  if (creepTypeSelected != "") {
    return creepTypeSelected
  }
  creepTypes.forEach(function (value: string, index: number, array: string[]) {
    if (value == type) {
      creepTypeSelected = value;
    }

    creepTypes.forEach(function (value: string, index: number, array: string[]) {
      if (value == type) {
        creepTypeSelected = value;

      }
      if (creepTypeSelected == "") {
        return
      }
    })


  })

}


