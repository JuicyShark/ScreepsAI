import { nameGen } from "utils/personality/nameGen";
import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { SpawnTask } from '../prototypes/Spawn'
import { allCreepTypes } from "../creepTypes/allTypes"

export class roomTypeBase {
    static creepName(type: string): string {
        return nameGen(type)

    }
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
    static calculate(room: Room, type: string, options): SpawnTask[] | null {

        var creepsToSpawn: SpawnTask[] = [];
        if (options.creepLength == options.creepTarget) {
            return null;
        } else {

            console.log(type + " " + options.creepLength + " " + options.creepTarget)

            let body: any = allCreepTypes.level1Types[type].body(room.energyCapacityAvailable)
            for (let i = options.creepLength; i < options.creepTarget; i++) {
                let temp = new SpawnTask(room.name, type, body, this.creepName(type));
                creepsToSpawn.push(temp);
            }
            return creepsToSpawn;
        }


    }

    static standardCreepDeployment(Colony: Colony, room: Room, targetSpawns: StructureSpawn[]): RTask | null {
        if (Colony.rooms.length == 1) {
            let creepTypes = allCreepTypes.level1Types
            let output = null;

            for (let type of Object.values(creepTypes)) {

                if (Colony.creepsByType[type.string] == undefined) {
                    let options = {
                        creepLength: 0,
                        creepTarget: creepTypes[type.string].creepAmmount[room.controller.level]

                    }
                    if (this.calculate(room, type.string, options) == null) {
                        continue;
                    }
                    let creepsToSpawn = this.calculate(room, type.string, options)
                    let roomTaskData = {
                        _colony: Colony,
                        roomName: room.name,
                        spawns: targetSpawns,
                        creeps: {
                            creepsByType: _.groupBy(Colony.creeps, creep => creep.memory.type)
                        },
                        data: creepsToSpawn
                    }
                    output = Room_Tasks.spawnCreeps(Colony, roomTaskData, options)
                    break;

                }
                else if (Colony.creepsByType[type.string] != undefined || Colony.creepsByType[type.string] < type.creepAmmount[room.controller.level]) {
                    let options = {
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



    static *spawnGuide() {
        const inside = yield



    }
}
