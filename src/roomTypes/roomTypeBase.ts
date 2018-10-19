import { nameGen } from "utils/personality/nameGen";
import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { SpawnTask } from '../prototypes/Spawn'
import { allCreepTypes } from "../creepTypes/allTypes"

export class roomTypeBase {

    static spawnBasicCreeps(Colony: Colony, room: Room): RTask | null {
        let spawns = room.spawns;
        let targetSpawns: StructureSpawn[] = [];


        spawns.forEach(function (spawn: StructureSpawn, index: number, array: StructureSpawn[]) {
            if (spawn.spawning == null) {
                targetSpawns.push(spawn);
            }
        })
        if (targetSpawns.length == 0) {
            return null
        } else {
            return this.standardCreepDeployment(Colony, room, targetSpawns)
        }
    }

    static creepName(type: string): string {
        return nameGen(type)

    }

    static calculate(room: Room, type: string, options): SpawnTask[] | null {

        var creepsToSpawn: SpawnTask[] = [];
        if (options.creepLength == options.creepTarget) {
            return null;
        } else {

            // console.log(type + " " + options.creepLength + " " + options.creepTarget)

            let body: any = allCreepTypes.level1Types[type].body(room.energyCapacityAvailable)
            for (let i = options.creepLength; i < options.creepTarget; i++) {
                let temp = new SpawnTask(room.name, type, body, this.creepName(type));
                creepsToSpawn.push(temp);
            }
            return creepsToSpawn;
        }
    }
    /**
     *  Level 1 Creeps
     * @param Colony
     * @param room
     * @param targetSpawns
     */
    static standardCreepDeployment(Colony: Colony, room: Room, targetSpawns: StructureSpawn[]): RTask | null {
        if (!Colony || !Colony.rooms) {
            return null
        }
        else if (Colony.rooms.length == 1) {
            var creepTypes = allCreepTypes.level1Types
            var output = null;
            var options = null;

            for (let type of Object.values(creepTypes)) {

                if (Colony.creepsByType[type.string] == undefined) {
                    options = {
                        creepLength: 0,
                        creepTarget: creepTypes[type.string].creepAmmount[room.controller.level]

                    }
                    if (this.calculate(room, type.string, options) == null) {
                        break;
                    }
                    var creepsToSpawn = this.calculate(room, type.string, options)

                    let roomTaskData = {
                        _colony: Colony,
                        roomName: room.name,
                        spawns: targetSpawns,
                        leftToSpawn: creepTypes[type.string].creepAmmount[room.controller.level],
                        creeps: {
                            creepsByType: _.groupBy(Colony.creeps, creep => creep.memory.type)
                        },
                        data: creepsToSpawn
                    }
                    output = Room_Tasks.spawnCreeps(Colony, roomTaskData, options)
                    break;

                }
                else if (Colony.creepsByType[type.string] != undefined || Colony.creepsByType[type.string] < type.creepAmmount[room.controller.level]) {
                    var myTemp: number | undefined = Colony.creepsByType[type.string].length;
                    options = {
                        creepLength: Colony.creepsByType[type.string].length,
                        creepTarget: creepTypes[type.string].creepAmmount[room.controller.level]
                    }
                    let creepsToSpawn = this.calculate(room, type.string, options)

                    let roomTaskData = {
                        _colony: Colony,
                        roomName: room.name,
                        spawns: targetSpawns,
                        creeps: {
                            creepsByType: _.groupBy(Colony.creeps, creep => creep.memory.type)
                        },
                        leftToSpawn: (myTemp - creepTypes[type.string].creepAmmount[room.controller.level]),
                        data: creepsToSpawn
                    }
                    output = Room_Tasks.spawnCreeps(Colony, roomTaskData, options)

                    break;
                }
            }

            if (output != null) {
                return output
            }
            else {
                return null
            }
        }

    }



    static *spawnGuide(Colony: Colony, room: Room) {
        const creepTypes = allCreepTypes.level1Types
        const trigger = yield "trueOrFalse";
        const creepType = yield "String CreepType";
        yield "Ready"
        //console.log(creepTypes[creepType].string)

        var whatDo: isSpawning | undefined = undefined;
        if (trigger == true && room.spawns[0].spawning == null) {
            if (Colony.creepsByType[creepType] == undefined || Colony.creepsByType[creepType].length < creepTypes[creepType].creepAmmount[room.controller.level]) {
                whatDo = { type: "canSpawn", boolean: true }
            } else {
                whatDo = { type: "Idle", boolean: true }
            }
        } else {
            whatDo = { type: "Idle", boolean: true }
        }
        yield whatDo; // Do it
    }
}
