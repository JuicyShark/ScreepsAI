import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { roomTypeBase } from './roomTypeBase';
import { allCreepTypes } from '../creepTypes/allTypes'

export class ColonyHub {

    /**
     *
     * @param Colony
     * @param room
     */
    static idleTask(Colony: Colony, room: Room) {
        let data = {
            _colony: Colony,
            roomName: room.name,
            data: {
                idleTill: (Game.time + 20)
            }

        }
        let temp = [
            Room_Tasks.roomIdle(Colony, data as RoomTaskData),
            Room_Tasks.roomIdle(Colony, data as RoomTaskData)
        ]


        room.RoomTask = Room_Tasks.chain(temp)
        // room.RoomTask = Room_Tasks.roomIdle(Colony, data as RoomTaskData);

    }
    /**
    *  Calls the SpawnTask for the room
    * @param Colony  Passed for link
    * @param room
    */
    static spawnTask(Colony: Colony, room: Room) {
        const creepTypes = allCreepTypes.level1Types

        if (roomTypeBase.spawnBasicCreeps(Colony, room) != null) {
            room.RoomTask = roomTypeBase.spawnBasicCreeps(Colony, room)
        } else { console.log("Catching Error in colony_Hub") }

    }



    /**
     * RoomTask!
     * Uses the spawnGuide generator function to do things. laid out so i can spread it!
     * @param room Room
     */
    static newRoomTask(Colony: Colony, room: Room): void {

        var selected = "GeneralHand"
        //the next one will be gud :3


        const Sb = roomTypeBase.spawnGuide(Colony, room) //declaring should start it up
        var trigger = false;

        if (room.RoomTask == null) {
            trigger = true;
        }
        Sb.next() //Returns value { "trueOrFalse"}


        Sb.next(trigger) //Triggering - returns value {"String CreepType"}


        Sb.next(selected) //SpawnType - returns value {"Ready"}
        let temp001 = Sb.next().value as isSpawning; //this call creates a value {isSpawning} Still being worked on.
        switch (temp001.type) {
            case undefined:
                console.log("Nothing yet")
                break;
            case "canSpawn":
                temp001.boolean ? this.spawnTask(Colony, room) : this.idleTask(Colony, room)
                break;
            case "Idle":
                temp001.boolean ? this.idleTask(Colony, room) : null
                break;
            default:
                console.log("defualtin")
                break;


        }
    }




}





