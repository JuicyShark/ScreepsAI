import { Tasks } from '../TaskManager/Tasks'


export class Miner {

    static newTask(creep: Creep): void {





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
        } else {

            for (let i = 0; i < creep.room.sources.length; i++) {
                let thisSource = creep.room.sources[i]
                let anyCon: StructureContainer | undefined = thisSource.pos.findClosestByLimitedRange(creep.room.containers, 1)
                if (anyCon != undefined) {
                    if (thisSource.hasMiner() == false) {
                        if (anyCon.targetedBy.length == 0) {
                            creep.memory.myContainer = anyCon.id;
                        }
                    }
                }


            }

        }
    }

}
