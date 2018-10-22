import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { roomTypeBase } from './roomTypeBase';
import { roomIdle } from './roomIdle'
import { extesnions } from './extensions'
import { allCreepTypes } from '../creepTypes/allTypes'

export class ColonyHub {

    static testTask(Colony: Colony) {

        let extensionCount = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][Colony.room.controller.level];
        let builtextensions = Colony.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION })
        if (builtextensions != null && builtextensions.length < extensionCount) {
            extesnions.testmeout(Colony, Colony.room)
        }
    }

    /**
     *
     * @param Colony
     * @param room
     */
    static idleTask(Colony: Colony) {
        let data = {
            _colony: Colony.id,
            roomName: Colony.room.name,
            data: {
                idleTill: (Game.time + 20)
            }

        }

        Colony.room.RoomTask = Room_Tasks.roomIdle(Colony, data as RoomTaskData);

    }
    /**
    *  Calls the SpawnTask for the room
    * @param Colony  Passed for link
    * @param room
    */
    static spawnTaskHub(Colony: Colony, creepType: string) {
        if (creepType != undefined || creepType != null) {
            Colony.room.RoomTask = roomTypeBase.spawnBasicCreeps(Colony, Colony.room, creepType)
        }
        if (Colony.room.RoomTask == null) {
            roomIdle.newRoomTask(Colony, Colony.room)
        }
    }

    static *ColonyHubGuide(Colony: Colony) {
        const thisRoomLink: Room = Colony.room
        const creepTypes = allCreepTypes.level1Types
        const trigger = yield "trueOrFalse";
        const creepType = yield "String CreepType";
        yield "Ready"
        //console.log(creepTypes[creepType].string)

        var whatDo: isSpawning | undefined = undefined;
        if (trigger == true) {
            if (Colony.creepsByType[creepType] == undefined || Colony.creepsByType[creepType].length < creepTypes[creepType].creepAmmount[thisRoomLink.controller.level]) {
                whatDo = { type: "canSpawn", boolean: true }
            } else {
                whatDo = { type: "Idle", boolean: true }
            }
        } else {
            whatDo = { type: "Idle", boolean: true }
        }
        yield whatDo; // Do it
    }


    /**
     * RoomTask!
     * Uses the spawnGuide generator function to do things. laid out so i can spread it!
     * @param room Room
     */
    static newRoomTask(Colony: Colony, room: Room): void {
        this.testTask(Colony)
        var creepTypes = allCreepTypes.level1Types
        var selected;

        for (let type in creepTypes) {
            var configAmmount = creepTypes[type].creepAmmount ? creepTypes[type].creepAmmount[room.controller.level] : 0

            if (Colony.creepsByType[type] == undefined || Colony.creepsByType[type].length < configAmmount) {
                selected = type
                break;
            }
        }

        //the next one will be gud :3

        const Sb = this.ColonyHubGuide(Colony) //declaring should start it up
        var trigger = false;

        if (room.RoomTask == null) {
            trigger = true;
        }
        Sb.next() //Returns value { "trueOrFalse"}
        //console.log("MY TRIGGER " + trigger)

        Sb.next(trigger) //Triggering - returns value {"String CreepType"}


        Sb.next(selected) //SpawnType - returns value {"Ready"}
        let temp001 = Sb.next().value as isSpawning; //this call creates a value {isSpawning} Still being worked on.
        switch (temp001.type) {
            case undefined:
                console.log("Having an issue Spawning in Colony_Hub")
                break;
            case "canSpawn":
                let creepType = selected;
                temp001.boolean ? this.spawnTaskHub(Colony, creepType) : roomIdle.newRoomTask(Colony, Colony.room)
                break;
            case "Idle":
                temp001.boolean ? roomIdle.newRoomTask(Colony, Colony.room) : null
                break;
            default:
                console.log("Having an issue and defaulting in Colony_Hub")
                break;


        }
    }




}





