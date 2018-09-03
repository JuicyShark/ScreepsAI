import * as creepMaster from '../ShowMaster/creepMaster';
import * as config from "config"



//Exports Below
export function shotCaller(): void {


    var ColonyRooms = Object.entries(Memory.Colonies.ColonyRooms)
    ColonyRooms.forEach(function (value: [string, {}], index: number, array: [string, {}][]): void {
        let room = Memory.Colonies.ColonyRooms[index];
        delegateToSpawns(this[value[0]])
        creepMaster.setCreepTasks()

    }, Game.rooms);

    //return
}

export function delegateToSpawns(room: Room): void {

    let creeps = _.values(Game.creeps) as Creep[];
    // Separate creeps by role
    let harvesters = _.filter(creeps, creep => creep.name.includes('Harvester'));
    let upgraders = _.filter(creeps, creep => creep.name.includes('Upgrader'));
    let builders = _.filter(creeps, creep => creep.name.includes('Builder'));
    let lorrys = _.filter(creeps, creep => creep.name.includes('Lorry'));
    let patrollers = _.filter(creeps, creep => creep.name.includes('Patroller'));
    let spawn: StructureSpawn | null = room.spawns[0];
    // Spawn creeps as needed
    if (spawn != null) {
        let type: string;
        let spawnTask;
        if (harvesters.length < 2) {
            type = 'Harvester';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask)
        } else if (upgraders.length < 2) {
            type = 'Upgrader';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask)
        } else if (builders.length < 2) {
            type = 'Builder';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask);
        } else if (lorrys.length < 2) {
            type = 'Lorry';
            spawnTask = {
                type: type,
                body: [CARRY, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask);
        } else { console.log("All Spawned") }
    }

}

export function queToSpawn(spawn: StructureSpawn, spawnTask: spawnTask): any {

    return spawn.spawnNewCreep(spawnTask.body, spawnTask.type, spawnTask.room)

}

// Room Structures Prototype should be saving structures as room prototypes example:
// testRoom.spawns = list of spawns available to that room
// testRoom.spawns[0] should return the first spawn object in the said room

/*export function initStructures(roomName: string): any {
    let MemPath = Memory.Colonies.ColonyRooms;
    let room = Game.rooms[roomName]
    console.log(room, MemPath[roomName])
    if (MemPath[roomName].structureIDs === undefined || MemPath[roomName].structureIDs.container === undefined || MemPath[roomName].structureIDs.controller.id === undefined) {
        MemPath[roomName].structureIDs = [];
        room.structures = room.find(FIND_MY_STRUCTURES);
        let mem = MemPath[roomName].structureIDs;
        for (var i = 0; i < room.structures.length; i++) {
            if (room.structures[i].structureType == "tower") {
                mem.Towers.push(room.structures[i].id)
            }
            if (room.structures[i].structureType == "spawn") {
                mem.Spawns.push(room.structures[i].id)
            }
            if (room.structures[i].structureType == "extension") {
                mem.Extensions.push(room.structures[i].id)
            }
            if (room.structures[i].structureType == "road") {
                mem.Roads.push(room.structures[i].id)
            }
            if (room.structures[i].structureType == "container") {
                if (room.structures[i] instanceof StructureContainer) {
                    MemPath[roomName].structureIDs.Containers.push(room.structures[i].id)
                }
            }
        }
        mem.controller.id = room.controller.id;
    }
}*/
