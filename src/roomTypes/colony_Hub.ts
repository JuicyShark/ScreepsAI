import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { roomTypeBase } from './roomTypeBase';
import { allCreepTypes } from '../creepTypes/allTypes'

export class ColonyHub {

    /**
     *
     * @param Colony
     * @param room
     */
    static idleTask(Colony: Colony, room: Room): any {
        let data = {
            _colony: Colony,
            roomName: room.name,
            data: {
                idleTill: (Game.time + 20)
            }

        }
        return room.RoomTask = Room_Tasks.roomIdle(Colony, data as RoomTaskData);

    }
    /**
    *  Calls the SpawnTask for the room
    * @param Colony  Passed for link
    * @param room
    */
    static spawnTask(Colony: Colony, room: Room): any {
        const creepTypes = allCreepTypes.level1Types

        if (roomTypeBase.spawnBasicCreeps(Colony, room) != null) {
            return room.RoomTask = roomTypeBase.spawnBasicCreeps(Colony, room)
        } else { console.log("Catching Error in colony_Hub") }

    }


    /**
     * RoomTask!
     * @param room Room
     */
    static newRoomTask(Colony: Colony, room: Room): void {
        const Sb = roomTypeBase.spawnGuide(Colony, room) //declaring should start it up

        Sb.next() //Returns value { "trueOrFalse"}
        Sb.next(true) //Triggering - returns value {"String CreepType"}
        Sb.next("GeneralHand") //SpawnType - returns value {"Ready"}
        let temp001 = Sb.next().value as isSpawning; //this call creates a value {isSpawning} Still being worked on.
        switch (temp001.type) {
            case undefined:
                console.log("Nothing yet")
                break;
            case "canSpawn":
                temp001.boolean ? this.spawnTask(Colony, room) : this.idleTask(Colony, room)
                break;
            default:
                console.log("defualtin")
                break;


        }
    }




}





