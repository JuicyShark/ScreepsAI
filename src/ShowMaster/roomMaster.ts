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
    let workers = _.filter(creeps, creep => creep.name.includes('Worker'));
    let upgraders = _.filter(creeps, creep => creep.name.includes('Upgrader'));
    let lorrys = _.filter(creeps, creep => creep.name.includes('lorry'));
    let patrollers = _.filter(creeps, creep => creep.name.includes('Patroller'));
    let spawn: StructureSpawn | null = Game.getObjectById(creepMaster.retreiveSpawnIDs(room)[0]);
    // Spawn creeps as needed
    if (spawn != null) {
        if (workers.length < 3) {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time);
        } else if (upgraders.length < 2) {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time);
        } else { console.log("All Spawned") }
    }

}


