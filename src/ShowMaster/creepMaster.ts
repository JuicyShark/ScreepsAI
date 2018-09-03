
import { RoleHarvester } from '../testRoles/harvester';
import { RoleUpgrader } from '../testRoles/upgrader';
import { RoleBuilder } from '../testRoles/builder';
import { RoleLorry } from '../testRoles/lorry';

export function runCreeps(): void {
    let creeps = _.values(Game.creeps) as Creep[];
    for (let creep of creeps) {
        creep.run();
    }
}

export function setCreepTasks(): void {

    let creeps = _.values(Game.creeps) as Creep[];
    // Separate creeps by role
    let harvesters = _.filter(creeps, creep => creep.name.includes('Harvester'));
    let upgraders = _.filter(creeps, creep => creep.name.includes('Upgrader'));
    let builders = _.filter(creeps, creep => creep.name.includes('Builder'));
    let lorrys = _.filter(creeps, creep => creep.name.includes('lorry'));
    let patrollers = _.filter(creeps, creep => creep.name.includes('Patroller'));
    //let spawn: StructureSpawn = Game.getObjectById(retreiveSpawnIDs(room)[0]);


    // Handle all roles, assigning each creep a new task if they are currently idle
    for (let harvester of harvesters) {
        if (harvester.isIdle) {
            RoleHarvester.newTask(harvester);
        }
    }
    for (let upgrader of upgraders) {
        if (upgrader.isIdle) {
            RoleUpgrader.newTask(upgrader);
        }
    }
    for (let builder of builders) {
        if (builder.isIdle) {
            RoleBuilder.newTask(builder);
        }
    }
    for (let lorry of lorrys) {
        if (lorry.isIdle) {
            RoleLorry.newTask(lorry);
        }
    }



}

export function retreiveSpawnIDs(room: Room): string[] {
    let output: string[] = [];
    var ColonyRooms = Object.keys(Memory.Colonies.ColonyRooms)
    ColonyRooms.forEach(element => {
        let roomSpawns = Memory.Colonies.ColonyRooms[element].structureIDs.Spawns
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
