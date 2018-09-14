import { Tasks } from '../TaskManager/Tasks'

export class Builder {

    static newTask(creep: Creep): void {
        if (creep.carry.energy != creep.carryCapacity) {

            var unattendedContainer = _.filter(creep.room.containers, container => container.isEmpty != true && container.targetedBy.length <= 2)[0];

            if (unattendedContainer == null) {
                let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 2)[0];
                creep.task = Tasks.harvest(unattendedSource)

            } else {
                creep.task = Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy)
            }
        } else {
            let site = creep.room.constructionSites[0]
            if (site != undefined) {
                creep.task = Tasks.build(site);
            }
            else if (site == undefined) {
                creep.task = Tasks.upgrade(Game.rooms[creep.memory.home].controller)
            }
        }
    }


}
