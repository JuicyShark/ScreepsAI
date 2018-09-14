
import { Harvester } from '../creepTypes/harvester';
import { Upgrader } from '../creepTypes/upgrader';
import { Builder } from '../creepTypes/builder';
import { Lorry } from '../creepTypes/lorry';
import { Colony } from '../Colony';

// set up how testRoles var will be set up. role is how it can be identified and
// unsure what declaration other than any for seperate functions in classes
interface creepTypes {
    [type: string]: any;
}
let creepTypes = {
    ["Harvester"]: Harvester,
    ["Upgrader"]: Upgrader,
    ["Builder"]: Builder,
    ["Lorry"]: Lorry
}

export function runCreeps(): void {
    let creeps = _.values(Game.creeps) as Creep[];
    for (let creep of creeps) {
        creep.run();
    }
}

export function setCreepTasks(colony: Colony) {
    var types = colony.creepsByType;
    // iterate over all roles currently available to the room
    for (var i in types) {
        // run through all creeps in selected role
        for (let creep of types[i]) {
            // is the creep idle?
            if (creep.isIdle === true) {
                //Get the right import from testRoles based on string
                creepTypes[creep.memory.type].newTask(creep);
            }
        }
    }
}
