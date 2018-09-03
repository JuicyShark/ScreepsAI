
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

export function setCreepTasks(colony) {

    // Handle all roles, assigning each creep a new task if they are currently idle
    if (colony.creepsByRole["Harvester"] != null) {
        let harvesters = colony.creepsByRole["Harvester"];
        for (let harvester of harvesters) {
            if (harvester.isIdle) {
                RoleHarvester.newTask(harvester);
            }
        }
    }
    if (colony.creepsByRole["Upgrader"] != null) {
        let upgraders = colony.creepsByRole["Upgrader"];
        for (let upgrader of upgraders) {
            if (upgrader.isIdle) {
                RoleUpgrader.newTask(upgrader);
            }
        }
    }
    if (colony.creepsByRole["Builder"] != null) {
        let builders = colony.creepsByRole["Builder"];
        for (let builder of builders) {
            if (builder.isIdle) {
                RoleBuilder.newTask(builder);
            }
        }
    }
    if (colony.creepsByRole["Lorry"] != null) {
        let lorrys = colony.creepsByRole["Lorry"];
        for (let lorry of lorrys) {
            if (lorry.isIdle) {
                RoleLorry.newTask(lorry);
            }
        }
    }
}
