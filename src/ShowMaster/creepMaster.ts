
import { RoleHarvester } from '../testRoles/harvester';
import { RoleUpgrader } from '../testRoles/upgrader';
import { RoleBuilder } from '../testRoles/builder';
import { RoleLorry } from '../testRoles/lorry';
import { Colony } from '../Colony';

// set up how testRoles var will be set up. role is how it can be identified and
// unsure what declaration other than any for seperate functions in classes
interface testRoles {
    [role: string]: any;
}
let testRoles = {
    ["Harvester"]: RoleHarvester,
    ["Upgrader"]: RoleUpgrader,
    ["Builder"]: RoleBuilder,
    ["Lorry"]: RoleLorry
}

export function runCreeps(): void {
    let creeps = _.values(Game.creeps) as Creep[];
    for (let creep of creeps) {
        creep.run();
    }
}

export function setCreepTasks(colony: Colony) {
    var role = colony.creepsByRole;
    // iterate over all roles currently available to the room
    for (var i in role) {
        // run through all creeps in selected role
        for (let creep of role[i]) {
            // is the creep idle?
            if (creep.isIdle === true) {
                //Get the right import from testRoles based on string
                testRoles[i].newTask(creep);
            }
        }
    }
}
