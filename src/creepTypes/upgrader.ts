import { Tasks } from '../TaskManager/Tasks'
export class Upgrader {


    private static upgradeTask(creep: Creep, thisCreepsTasks: any): any {

        thisCreepsTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))

        return thisCreepsTasks

    }

    private static harvestTask(creep: Creep, thisCreepsTasks: any): any {
        var unattendedContainer = _.filter(creep.room.containers, container => container.isEmpty != true && container.energy > 200 && container.targetedBy.length <= 2)[0];

        if (unattendedContainer == null) {
            let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 2)[0];

            if (unattendedContainer == null) {
                let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 4)[0];
                thisCreepsTasks.push(Tasks.harvest(unattendedSource))

            } else {
                thisCreepsTasks.push(Tasks.harvest(unattendedSource))
            }

        } else {
            thisCreepsTasks.push(Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy))
        }

        return thisCreepsTasks

    }

    // Upgraders will harvest to get energy, then upgrade the controller
    static newTask(creep: Creep): void {
        let thisCreepsTasks: any = []
        if (creep.carry.energy == creep.carryCapacity) {

            this.upgradeTask(creep, thisCreepsTasks)

        } else {

            this.harvestTask(creep, thisCreepsTasks)


        }
        creep.task = Tasks.chain(thisCreepsTasks)
    }


}
