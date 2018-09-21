import { Tasks } from '../TaskManager/Tasks'



export class Defender {

    static newTask(creep: Creep): void {
        let taskList: any = [];
        if (creep.room.hostiles != undefined && creep.room.hostiles.length >= 1) {
            creep.room.hostiles.forEach(function (badGuy: Creep, index: number) {
                taskList.push(Tasks.meleeAttack(badGuy))
            })

            if (taskList.length != 0) {
                creep.task = Tasks.chain(taskList)
            }
        }
        else {
            if (creep.room.flags["IdleFlag"] != undefined) {
                let flagpos = creep.room.flags["IdleFlag"].pos
                if (creep.pos.findClosestByLimitedRange(flagpos, 3)) {
                    //waiting for hostiles :D
                }
                else {
                    creep.task = Tasks.goTo(flagpos)
                }
            }
        }


    }

}
