import { Tasks } from '../TaskManager/Tasks'
import { GeneralHand } from './generalhand';
export class Upgrader {


    private static upgradeTask(creep: Creep, thisCreepsTasks: any): any {

        thisCreepsTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))

        return thisCreepsTasks

    }

    // Upgraders will harvest to get energy, then upgrade the controller
    static newTask(creep: Creep): void {
        let thisCreepsTasks: any = []
        if (creep.carry.energy == creep.carryCapacity) {

            this.upgradeTask(creep, thisCreepsTasks)

        } else {
            //looking for containers in range of 5
            let nearContainer: StructureContainer | undefined = creep.pos.findClosestByLimitedRange(creep.room.containers, 5)
            if (nearContainer != undefined) {
                if (nearContainer.energy > (creep.carryCapacity * 1.5)) {
                    thisCreepsTasks.push(Tasks.withdraw(nearContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy))
                }
            }
            else {
                GeneralHand.harvestTask(creep, thisCreepsTasks)
            }
        }
        if (thisCreepsTasks.length != 0) {

            creep.task = Tasks.chain(thisCreepsTasks)
        }
    }


}
