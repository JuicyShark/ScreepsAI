import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { roomTypeBase } from './roomTypeBase';
import { allCreepTypes } from '../creepTypes/allTypes'

export class ColonyHub {


    static extensionsTask(Colony: Colony) {
        let testt = roomTypeBase.extensions(Colony.room.name)

        let data = {
            _colony: Colony.id,
            roomName: Colony.room.name,
            data: {
                idleTill: (Game.time + 10),
                homeZone: testt.homeZone,
                homeZonePath: testt.homeZonePath,
                extensionCount: testt.extensionCount,
                builtextensions: testt.builtextensions,
                wipExtensions: testt.wipExtensions
            }
        }

        Colony.room.RoomTask = Room_Tasks.extentions(Colony, data as RoomTaskData)

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
            Colony.room.RoomTask = roomTypeBase.spawnBasicCreeps(Colony, Colony.room.name, creepType)
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
        var extensionCount = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][Colony.room.controller.level];
        var builtextensions = Colony.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION })
        var wipExtensions = Colony.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION })

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

        if (trigger == true && creepType != null) {
            if (Colony.creepsByType[creepType] == undefined || Colony.creepsByType[creepType].length < creepTypes[creepType].creepAmmount[thisRoomLink.controller.level]) {
                outp = { boolean: true, info: { type: "canSpawn" } }
            } else {
                outp = { boolean: true, info: { type: "Idle" } }
            }
        } else {
            if (thisRoomLink.controller.level == 1) {
                outp = { boolean: true, info: { tyoe: "Idle" } }
            }
            else if (!wipExtensions.length || (builtextensions.length + wipExtensions.length) < extensionCount) {
                outp = { boolean: true, info: { type: "Extensions" } }
            } else if ((builtextensions.length + wipExtensions.length) == extensionCount) {
                outp = { boolean: true, info: { type: "Idle" } }
            }
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
                if (configAmmount >= 1) {
                    selected = type
                    break;
                }
                else if (configAmmount == 0) {
                    selected = null
                }
            }
        }


        const Sb = this.ColonyHubGuide(Colony) //declaring should start it up
        var trigger = false;

        if (room.RoomTask == null) {
            trigger = true;
        }
        Sb.next() //Yeild starting outp

        Sb.next(true) //Triggering


        Sb.next(selected) //SpawnType - returns value {"Ready"}
        let temp001 = Sb.next().value as outp; //this call creates a value {isSpawning} Still being worked on.
        switch (temp001.info.type) {
            case undefined:
                Colony.room.memLog = "Having and Issue with The Tasks... Idling (Maybe lvl1?)"
                this.idleTask(Colony)
                break;
            case "canSpawn":
                let creepType = selected;
                temp001.boolean ? this.spawnTaskHub(Colony, creepType) : this.idleTask(Colony)
                break;
            case "Idle":
                temp001.boolean ? this.idleTask(Colony) : null
                break;
            case "Extensions":
                temp001.boolean ? this.extensionsTask(Colony) : null
                break;
            default:
                temp001.boolean ? this.idleTask(Colony) : null
                break;


        }
    }




}
