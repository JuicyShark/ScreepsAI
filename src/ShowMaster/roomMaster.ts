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
        global.colony = new Colony(1, this[value[0]].name, []);
        var colony = global.colony;
        delegateToSpawns(colony)
        creepMaster.setCreepTasks(colony)
    }, Game.rooms);
}

export function delegateToSpawns(colony: Colony): void {
    // Separate creeps by role
    let harvesters: Creep[] | undefined = colony.creepsByRole["Harvester"];
    let upgraders: Creep[] | undefined = colony.creepsByRole["Upgrader"];
    let builders: Creep[] | undefined = colony.creepsByRole["Builder"];
    let lorrys: Creep[] | undefined = colony.creepsByRole["Lorry"];
    let patrollers: Creep[] | undefined = colony.creepsByRole["Patroller"];
    let spawn: StructureSpawn | null = colony.room.spawns[0];
    // Spawn creeps as needed
    if (spawn != null) {
        let type: string;
        let spawnTask;
        if (harvesters == undefined || harvesters.length < 2) {
            type = 'Harvester';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask)
        } else if (upgraders == undefined || upgraders.length < 2) {
            type = 'Upgrader';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask)
        } else if (builders == undefined || builders.length < 2) {
            type = 'Builder';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask);
        } else if (lorrys == undefined || lorrys.length < 2) {
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
