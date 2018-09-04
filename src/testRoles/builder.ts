import { Tasks } from '../TaskManager/Tasks'

export class RoleBuilder {

    static newTask(creep: Creep): void {
        if (creep.carry.energy < creep.carryCapacity || creep.carry.energy != creep.carryCapacity) {
            // Harvest from an empty source if there is one, else pick any source
            let sources = creep.room.sources
            let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
            if (unattendedSource) {
                creep.task = Tasks.harvest(unattendedSource);
            } else {
                creep.task = Tasks.withdraw(creep.room.containers[0], RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy)
            }
        } else {
            let site = creep.room.constructionSites[0]
            if (site != undefined) {
                creep.task = Tasks.build(site);
            }
            else { }
        }
    }


}
