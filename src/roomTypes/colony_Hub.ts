import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { roomTypeBase } from './roomTypeBase';
import { extesnions } from './extensions'
import { allCreepTypes } from '../creepTypes/allTypes'

export class ColonyHub {

    static testTask(Colony: Colony) {
        /*
                let extensionCount = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][Colony.room.controller.level];
                let builtextensions = Colony.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION })
                if (builtextensions != null && builtextensions.length < extensionCount) {
                    extesnions.testmeout(Colony, Colony.room)
                }*/
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
            this.idleTask(Colony)
        }
    }

    /**
     * Generator Function,
     * Takes Colony Object and guides it through its chain of command. Giving back multiple Responses
     * Standardazing responses to a object similar to the generator function will give us a more rebust
     * way of dealing with our "Tour Guide" Here...
     * Example:
     * Me: Guide(Question)
     * Guide: { value:{{T/F: Bool, info:{}}},done: false}
     *
     * This should allow us to combine switch and relay relevant information
     * We can add an eventRoomLog handler and I could go on and on.
     *
     */

    static *ColonyHubGuide(Colony: Colony) {
        const thisRoomLink: Room = Colony.room
        var outp: outp;
        const creepTypes = allCreepTypes.level1Types
        outp = { boolean: true, info: "Starting" }
        const trigger = yield outp;
        outp = { boolean: true, info: trigger }
        const creepType = yield outp;
        outp = { boolean: true, info: "Ready" }
        yield outp
        //console.log(creepTypes[creepType].string)


        if (trigger == true) {
            if (Colony.creepsByType[creepType] == undefined || Colony.creepsByType[creepType].length < creepTypes[creepType].creepAmmount[thisRoomLink.controller.level]) {
                outp = { boolean: true, info: { type: "canSpawn" } }
            } else {
                outp = { boolean: true, info: { type: "Idle" } }
            }
        } else {
            outp = { boolean: true, info: { type: "Idle" } }
        }
        yield outp; // Do it
    }


    /**
     * RoomTask!
     * Uses the spawnGuide generator function to do things. laid out so i can spread it!
     * @param room Room
     */
    static newRoomTask(Colony: Colony, room: Room): void {
        var creepTypes = allCreepTypes.level1Types
        var selected;

        //Here we are asking "What would the config ammount be? - not specified? 0"
        for (let type in creepTypes) {
            var configAmmount = creepTypes[type].creepAmmount ? creepTypes[type].creepAmmount[room.controller.level] : 0

            if (Colony.creepsByType[type] == undefined || Colony.creepsByType[type].length < configAmmount) {
                selected = type
                break;
            }
        }


        const Sb = this.ColonyHubGuide(Colony) //declaring should start it up
        var trigger = false;

        if (room.RoomTask == null) {
            trigger = true;
        }
        Sb.next() //Returns value { "trueOrFalse"}
        //console.log("MY TRIGGER " + trigger)

        Sb.next(trigger) //Triggering - returns value {"String CreepType"}


        Sb.next(selected) //SpawnType - returns value {"Ready"}
        let temp001 = Sb.next().value as outp; //this call creates a value {isSpawning} Still being worked on.
        switch (temp001.info.type) {
            case undefined:
                console.log("Having an issue Spawning in Colony_Hub")
                break;
            case "canSpawn":
                let creepType = selected;
                temp001.boolean ? this.spawnTaskHub(Colony, creepType) : this.idleTask(Colony)
                break;
            case "Idle":
                temp001.boolean ? this.idleTask(Colony) : null
                break;
            default:
                console.log("Having an issue and defaulting in Colony_Hub")
                break;


        }
    }




}





