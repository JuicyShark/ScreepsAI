import { nameGen } from "utils/personality/nameGen";
import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { SpawnTask } from '../prototypes/Spawn'
import { allCreepTypes } from "../creepTypes/allTypes"

export class roomTypeBase {

    static spawnBasicCreeps(Colony: Colony, room: string, creepType: string): RTask | null {
        let spawns = Game.rooms[room].find(FIND_MY_SPAWNS);
        let targetSpawns: string[] = [];

        spawns.forEach(function (spawn: StructureSpawn, index: number, array: StructureSpawn[]) {
            if (spawn instanceof StructureSpawn) {
                targetSpawns.push(spawn.name);
            }
        })

        if (targetSpawns.length == 0) {
            return null
        } else {
            return this.standardCreepDeployment(Colony, Game.rooms[room], targetSpawns, creepType)
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

    static extensions(roomName) {


        const room = Game.rooms[roomName]
        const terrain = new Room.Terrain(roomName);
        const matrix = new PathFinder.CostMatrix;
        var homeZone: RoomPosition[] = [];
        var homeZonePath: RoomPosition[] = []
        var extensionCount = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
        var builtextensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION })
        var wipExtensions = room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION })

        // Fill CostMatrix with default terrain costs for future analysis:
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                const roomPos = new RoomPosition(x, y, room.name)
                const structs = room.lookForAt(LOOK_STRUCTURES, roomPos).filter(
                    (s) => s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_TOWER ||
                        s.structureType == STRUCTURE_SPAWN)
                const constructs = room.lookForAt(LOOK_CONSTRUCTION_SITES, roomPos).filter((s) => s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_ROAD)

                const weight =
                    tile === TERRAIN_MASK_WALL ? 255 : // wall  => unwalkable
                        tile === TERRAIN_MASK_SWAMP ? 5 : // swamp => weight:  5
                            1; // plain => weight:  1
                matrix.set(x, y, weight);
                if (roomPos.getRangeTo(room.spawns[0]) <= 8) {
                    if ((x + y) % 2 === 0 && weight != 255) {
                        if (structs.length || constructs.length) {
                        } else {
                            homeZone.push(roomPos)
                        }
                    }
                    else if ((x + y) % 1 === 0 && weight != 255) {
                        if (structs.length || constructs.length) {
                        } else {
                            homeZonePath.push(roomPos)
                        }
                    }
                }

            }
        }

        let myReturn = {
            homeZone: homeZone,
            homeZonePath: homeZonePath,
            extensionCount: extensionCount,
            builtextensions: builtextensions,
            wipExtensions: wipExtensions
        }
        return myReturn

    }
}
