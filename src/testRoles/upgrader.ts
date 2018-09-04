import { Tasks } from '../TaskManager/Tasks'
export class RoleUpgrader {

    // Upgraders will harvest to get energy, then upgrade the controller
    static newTask(creep: Creep): void {
        if (creep.carry.energy > 0) {
            creep.task = Tasks.upgrade(creep.room.controller!); // assumes creep in in room with controller
        } else {
            let unattendedSource = _.filter(creep.room.containers, container => container.isEmpty != true && container.targetedBy.length <= 2)[0];
            creep.task = Tasks.withdraw(unattendedSource, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy)
        }
    }

}
