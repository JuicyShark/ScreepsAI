import { Tasks } from '../TaskManager/Tasks'


export class Miner {

    static newTask(creep: Creep): void {

        let unattendedContainer = _.filter(creep.room.containers, container => container.pos.findClosestByLimitedRange(creep.room.sources, 2) && container.targetedBy.length == 0)[0]

        if (!creep.memory.myContainer) {

            creep.memory.myContainer = unattendedContainer.id;
        }
        let container: StructureContainer = Game.getObjectById(creep.memory.myContainer)

        let source: Source | undefined = container.pos.findClosestByLimitedRange(creep.room.sources, 2);
        if (source != undefined) {
            if (creep.pos.x != container.pos.x && creep.pos.y != container.pos.y) {
                creep.task = Tasks.goTo(container)

            }
            else if (creep.pos.x == container.pos.x && creep.pos.y == container.pos.y) {
                creep.task = Tasks.harvest(source)
            }
        }
    }

}
