
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

    let myRooms, controllerLevel;
    for (const i in Game.rooms) {
        let room = Game.rooms[i]
        let roomOutposts = room.memory.outposts;
        let roomName: string = room.name
        console.log(room.my + " my room test ")
        if (room.controller != undefined && room.my === true && room.spawns != undefined) {
            controllerLevel = room.controller.level;
        }
        myRooms = {
            [roomName]: {
                spawns: room.spawns,
                RoomLevel: [controllerLevel],
                outposts: roomOutposts
            }
        }
    }

    return {
        ColonySize: 1,
        ColonyRooms: myRooms
    }
}


