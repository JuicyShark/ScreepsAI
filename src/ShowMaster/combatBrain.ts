import { Defender } from "creepTypes/defender";

//Combat and strataga!!

export function alertMode(room: Room) {

}

export class combatBrain {


    static scoutRoom(roomTargeted: string) {
        var gameRooms: Room[] = Object.values(Game.rooms)
        let foundTarget: boolean | null = null

        for (let i = 0; i < gameRooms.length; i++) {
            if (roomTargeted == gameRooms[i].name) {
                //check if theres info collected

                foundTarget = true;
                break;
            }
            else {
                continue;
            }
        }


        if (foundTarget != null) {
            //Do next thing with combat? :P
        }
        else {
            //check if/get the room to spawn a scout.


        }

    }

    static getCurrentOrders(creep: Creep): combatOrder {
        let relevantOrder: combatOrder | null = null;

        if (creep.memory.type == "Defender") {

        }

        if (relevantOrder != null) {
            return relevantOrder
        }
    }


}
