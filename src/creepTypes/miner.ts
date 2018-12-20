import { Tasks } from '../TaskManager/Tasks'


export class Miner {
    /**
     * Create a New Miner Task
     * @param creep
     */
    static newTask(creep: Creep): void {
        var source
        let nearSource: any = creep.pos.findClosestByLimitedRange(creep.room.sources, 1)

        if (!creep.memory.mySource) {
            source = creep.pos.findClosestByPath(creep.room.sources)

        } else {
            source = creep.memory.mySource
        }
        //end declairations

        //function
        //if creep is near source
        if (nearSource) {
            creep.task = Tasks.harvest(source)
        } else {
            //creep.task = Tasks.idleFor(10)
        }

    }
}

