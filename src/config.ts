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
  let Team: [string, string] = [
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
  "Patroller"
]
export function creepPriority(type: string): number {
  let temp = [
    {
      type: "GeneralHand",
      priority: 2
    },
    {
      type: "Builder",
      priority: 4
    },
    {
      type: "Upgrader",
      priority: 3
    },
    {
      type: "Miner",
      priority: 2
    },
    {
      type: "Lorry",
      priority: 2
    },
    {
      type: "Patroller",
      priority: 2
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
  "ColonyHub",
  "Basic",
  "Spawner",
  "Highway",
  "Outpost"
]

function createBody(type: string, room: Room): string[] {
  var energy = room.energyCapacityAvailable
  //creating a balanced body
  if (
    type == "GeneralHand" || type == "Upgrader" || type == "Builder") {
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
    if (energy == 300) {
      var numberOfWorkParts = 2;
    }
    else {
      var numberOfWorkParts = (energy / 200)
    }
    // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
    var body: string[] = [];
    for (let i = 0; i < numberOfWorkParts; i++) {
      body.push("work");
    }
    // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
    energy -= 150 * numberOfWorkParts;

    var numberOfParts = Math.floor(energy / 100);
    numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
    for (let i = 0; i < numberOfParts; i++) {
      body.push("carry");
    }
    for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
      body.push("move");
    }
    return body;
  }
  if (type == "Patroller") {
    var numberOfParts = Math.floor(energy / 100);
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 4));
    var body: string[] = [];
    for (let i = 0; i < numberOfParts; i++) {
      body.push("attack");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("tough");
    }

    numberOfParts = Math.floor(energy / 50)
    numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 1) / 1));
    for (let i = 0; i < numberOfParts; i++) {
      body.push("move");
    }
    return body;

  }
  if (type == "Lorry") {
    var numberOfParts = Math.floor(energy / 100);
    numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
    for (let i = 0; i < numberOfParts; i++) {
      body.push("carry");
    }
    for (let i = 0; i < numberOfParts; i++) {
      body.push("move");
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


