import { Tasks } from '../TaskManager/Tasks'


export class Miner {

    static newTask(creep: Creep): void {

        var containerSource = creep.room.sources.forEach(function (source) {
            if (source.hasMiner() == false) {
                let anyCon: StructureContainer | undefined = source.pos.findClosestByLimitedRange(creep.room.containers, 1)
                if (anyCon != undefined) {

                    if (!creep.memory.myContainer) {
                        creep.memory.myContainer = anyCon.id;
                    }
                }
            }
        })



        let container: StructureContainer = Game.getObjectById(creep.memory.myContainer)

        if (container != undefined) {
            if (creep.pos.x != container.pos.x && creep.pos.y != container.pos.y) {
                creep.task = Tasks.goTo(container)

            }
            else if (creep.pos.x == container.pos.x && creep.pos.y == container.pos.y) {

                let temp = container.pos.findClosestByLimitedRange(creep.room.sources, 2)
                if (temp != undefined) {
                    creep.task = Tasks.harvest(temp)
                }
            }
        }
    }

}
