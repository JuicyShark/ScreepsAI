import { Tasks } from '../TaskManager/Tasks'


export class Miner {

    static newTask(creep: Creep): void {





        let container: StructureContainer = Game.getObjectById(creep.memory.myContainer)
        let destination = creep.memory.destination
        if (destination != null) {
            if (destination != creep.room.name) {
                creep.task = Tasks.goToRoom(destination)
            }
            else if (destination == creep.room.name) {
                creep.task = Tasks.goTo(Game.rooms[destination].controller)
                if (creep.memory.mySource != undefined) {
                    creep.task = Tasks.chain(
                        [
                            Tasks.goTo(Game.getObjectById(creep.memory.mySource)),
                            Tasks.harvest(Game.getObjectById(creep.memory.mySource))
                        ]
                    )
                }


            }
        }
        else {

            if (container != undefined) {
                let temp = container.pos.findClosestByLimitedRange(creep.room.sources, 2)
                if (creep.pos.x != container.pos.x && creep.pos.y != container.pos.y) {
                    creep.task = Tasks.chain(
                        [
                            Tasks.goToContainer(container),
                            Tasks.harvest(temp)
                        ]
                    )


                } else {
                    creep.task = Tasks.harvest(temp)
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

}
