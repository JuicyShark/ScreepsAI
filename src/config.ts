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
    "Harvester",
    "Builder",
    "Upgrader",
    "Miner",
    "Lorry"
]
export var roomTypes: string[] = [
    "ColonyHub",
    "Basic",
    "Spawner",
    "Highway",
    "Outpost"
]

export function configCreepTypes(type: string): string {

    let creepTypeSelected: string = "";
    if (creepTypeSelected != "") {
        return creepTypeSelected
    }
    creepTypes.forEach(function (value: string, index: number, array: string[]) {
        if (value == type) {
            creepTypeSelected = value;

        }
    })

}


