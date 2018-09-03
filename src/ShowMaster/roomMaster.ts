import * as creepMaster from '../ShowMaster/creepMaster';
import * as magicianMaster from '../ShowMaster/magicianMaster';
import { Colony } from '../Colony'


//Exports Below
/*export function delegateTimeSlots(room: Room): void {
    if(room.playerHostiles != undefined) {

    }
    //getRoomNeedsInPriority
}*/

export function shotCaller(): void {
    var ColonyRooms = Object.entries(Memory.Colonies.ColonyRooms)
    ColonyRooms.forEach(function (value: [string, {}], index: number, array: [string, {}][]): void {
        var test = new Colony(1, this[value[0]].name, []);
        delegateToSpawns(this[value[0]])
        creepMaster.setCreepTasks()
    }, Game.rooms);
}

export function delegateToSpawns(room: Room): void {
    let creeps = room.creeps as Creep[];
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
