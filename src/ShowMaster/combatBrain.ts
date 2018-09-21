import { SpawnBrain } from '../prototypes/Spawn'
//Combat and strataga!!

export function alertMode(room: Room) {

}

export class CombatBrain {


    static scoutRoom(roomTargeted: string) {
        var gameRooms: Room[] = Object.values(Game.rooms)
        let foundTarget: boolean | null = null

        for (let i = 0; i < gameRooms.length; i++) {
            if (roomTargeted == gameRooms[i].name) {
                let roomFlags = Game.rooms[roomTargeted].flags
                //check if theres info collected
                for (let ii in roomFlags) {
                    var thisFlag = roomFlags[ii]
                    if (thisFlag.isScoutFlag == true) {
                        if (thisFlag.memory == undefined) {
                            var mem = roomFlags[ii].memory;
                            var temp: FlagMemory | null;
                            let scout: Creep | undefined = roomFlags[ii].pos.findClosestByLimitedRange(Game.rooms[roomTargeted].creepsByType.Scout, 2)

                            if (scout != undefined) {
                                temp = {
                                    scoutPresent: scout,
                                    scoutAssigned: scout
                                }
                            }
                            if (temp != null) {
                                roomFlags[ii].memory = temp;
                            }
                        }
                        else if (thisFlag.memory != undefined) {

                        }

                    }
                }

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
        else if (creep.memory.type == "Patroller") {

        }

        if (relevantOrder != null) {
            return relevantOrder
        }
    }
    static defendeRoom(room: Room): void {
        if (room.dangerousHostiles != null) {
            let neededDefenders = (room.dangerousPlayerHostiles.length + 1)
            let generalCreeps: Creep[] | null = SpawnBrain.thisColony(room).creepsByType.GeneralHand;
            let defenders: Creep[] | null = SpawnBrain.thisColony(room).creepsByType.Defender;
            if (generalCreeps != null) {
                if (defenders == null || defenders.length <= neededDefenders) {
                    SpawnBrain.creepBuilder("Defender", room, null)
                }
            }
        }



    }


}
