import { Tasks } from '../TaskManager/Tasks'


export class RoleHarvester {

    // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
    // This module demonstrates the RoomObject.targetedBy functionality
    static newTask(creep: Creep): void {
        if (creep.carry.energy < creep.carryCapacity || creep.carry.energy != creep.carryCapacity) {
            // Harvest from an empty source if there is one, else pick any source
            let sources = creep.room.sources;
            let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
            console.log(sources, unattendedSource)
            if (unattendedSource != null) {
                creep.task = Tasks.harvest(unattendedSource);
            } else {
                console.log(creep.room.containers[0])
                let tasks = [Tasks.withdraw(creep.room.containers[0], RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy), Tasks.build(creep.room.constructionSites[0])]
                creep.task = Tasks.chain(tasks);
            }
        } else {
            let spawn = creep.room.spawns[0];
            if (spawn != undefined) {
                creep.task = Tasks.transfer(spawn);
            }
            else { }
        }
    }

}
