import { nameGen } from "utils/personality/nameGen";
import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { SpawnTask } from '../prototypes/Spawn'
import { allCreepTypes } from "../creepTypes/allTypes"

export class roomTypeBase {

    static spawnBasicCreeps(Colony: Colony, room: Room, creepType: string): RTask | null {
        let spawns = room.spawns
        let targetSpawns: string[] = [];


        spawns.forEach(function (spawn: StructureSpawn, index: number, array: StructureSpawn[]) {
            if (spawn instanceof StructureSpawn) {
                targetSpawns.push(spawn.name);
            }
        })

        if (targetSpawns.length == 0) {
            return null
        } else {
            return this.standardCreepDeployment(Colony, room, targetSpawns, creepType)
        }
    }

    static creepName(type: string): string {
        return nameGen(type)

    }

    static spawnTaskFiller(room: Room, type: string, options: RoomTaskOptions): SpawnTask[] | null {

        var creepsToSpawn: SpawnTask[] = [];
        if (options.creepLength == options.creepTarget) {
            return null;
        } else {
            var energy;
            if (room.creeps.length <= 4) {
                energy = 300;
            } else {
                energy = room.energyCapacityAvailable
            }

            // console.log(type + " " + options.creepLength + " " + options.creepTarget)

            let body: any = allCreepTypes.level1Types[type].body(energy)
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
    static standardCreepDeployment(Colony: Colony, room: Room, targetSpawns: string[], creepType: string): RTask | null {
        if (!Colony || !Colony.rooms) {
            return null
        }
        else {

            var creepTypes = allCreepTypes.level1Types
            var type = creepTypes[creepType]
            var output = null;
            var options: RoomTaskOptions = null;

            var creepsToSpawn: SpawnTask[] | null | undefined;

            if (Colony.creepsByType[type.string] == undefined) {
                options = {
                    creepLength: 0,
                    creepTarget: creepTypes[type.string].creepAmmount[room.controller.level] ? creepTypes[type.string].creepAmmount[room.controller.level] : 0

                }
                creepsToSpawn = this.spawnTaskFiller(room, type.string, options)
                if (creepsToSpawn == null || creepsToSpawn.length == 0) {
                    return null
                }
                let roomTaskData = {
                    _colony: Colony.id,
                    roomName: room.name,
                    spawns: targetSpawns,
                    leftToSpawn: creepsToSpawn.length,
                    data: creepsToSpawn
                }
                output = Room_Tasks.spawnCreeps(Colony, roomTaskData, options)
            }
            else if (Colony.creepsByType[type.string] != undefined || Colony.creepsByType[type.string] < type.creepAmmount[room.controller.level]) {

                options = {
                    creepLength: Colony.creepsByType[type.string] ? Colony.creepsByType[type.string].length : 0,
                    creepTarget: creepTypes[type.string].creepAmmount ? creepTypes[type.string].creepAmmount[room.controller.level] : 0
                }
                creepsToSpawn = this.spawnTaskFiller(room, type.string, options)

                let roomTaskData = {
                    _colony: Colony.id,
                    roomName: room.name,
                    spawns: targetSpawns,
                    leftToSpawn: creepsToSpawn.length,
                    data: creepsToSpawn
                }
                output = Room_Tasks.spawnCreeps(Colony, roomTaskData, options)

            }


            if (output != null) {
                return output
            }
            else {
                return null
            }
        }

    }



}
