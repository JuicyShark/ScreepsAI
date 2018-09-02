
import { RoleHarvester } from '../testRoles/harvester';
import { RoleUpgrader } from '../testRoles/upgrader';

export function runCreeps(): void {
    let creeps = _.values(Game.creeps) as Creep[];
    for (let creep of creeps) {
        creep.run();
    }
}

export function setCreepTasks(): void {

    let creeps = _.values(Game.creeps) as Creep[];
    // Separate creeps by role
    let workers = _.filter(creeps, creep => creep.name.includes('Worker'));
    let upgraders = _.filter(creeps, creep => creep.name.includes('Upgrader'));
    let lorrys = _.filter(creeps, creep => creep.name.includes('lorry'));
    let patrollers = _.filter(creeps, creep => creep.name.includes('Patroller'));
    //let spawn: StructureSpawn = Game.getObjectById(retreiveSpawnIDs(room)[0]);


    // Handle all roles, assigning each creep a new task if they are currently idle
    for (let worker of workers) {
        if (worker.isIdle) {
            RoleHarvester.newTask(worker);
        }
    }
    for (let upgrader of upgraders) {
        if (upgrader.isIdle) {
            RoleUpgrader.newTask(upgrader);
        }
    }



}

export function retreiveSpawnIDs(room: Room): string[] {
    let output: string[] = [];
    var ColonyRooms = Object.keys(Memory.Colonies.ColonyRooms)
    ColonyRooms.forEach(element => {
        let roomSpawns = Memory.Colonies.ColonyRooms[element].spawns
        let checkSpawns = Object.values(roomSpawns).forEach(function (value: {}, index: number, array: {}[]): void {
            if (roomSpawns[index] == "" || roomSpawns[index] == "null") {
                //console.log("SpawnNothing! " + roomSpawns[index])
            }
            else {
                //console.log("YAS BOI " + roomSpawns[index])
                output.push(roomSpawns[index])
            }
        });
    });

    //returns  an array with up to 3 spawn structure IDs
    return output
}
