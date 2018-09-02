
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

//CPU BUCKET LIMITS
export const minBucket: number = 3000;
export const safeBucketLimit: number = 8000;

//COLONIES STRUCTURE SETUP
export function defaultColoniesMem(): Object {

    let myRooms, controllerLevel;
    for (const i in Game.rooms) {
        let room = Game.rooms[i]
        let roomName: string = room.name
        if (room.controller != undefined) {
            controllerLevel = room.controller.level;
        }
        myRooms = {
            [roomName]: {
                spawns: getSpawns(room),
                RoomLevel: [controllerLevel]
            }
        }
    }

    return {
        ColonySize: 1,
        ColonyRooms: myRooms
    }
}

export function getSpawns(room: Room): string {
    let spawns = room.find(FIND_MY_SPAWNS);
    let output: string[] = []
    spawns.forEach(function (value: StructureSpawn, index: number, array: StructureSpawn[]) {
        if (spawns[index] != null) {
            output.push(spawns[index].id);
        }

    })
    return output[0];
}
