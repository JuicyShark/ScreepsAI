import { Tasks } from '../TaskManager/Tasks'


export class Scout {

    static newTask(creep: Creep) {

        if (creep.memory.destination != undefined && creep.room.name != creep.memory.destination) {
            creep.task = Tasks.goToRoom(creep.memory.destination)
        } else if (creep.room.name == creep.memory.destination) {
            if (creep.pos.x != Game.flags["Scout"].pos.x) {
                creep.task = Tasks.goTo(Game.flags["Scout"])
            }
        }
        else if (!creep.memory.destination) {
            creep.memory.destination = Game.flags["Scout"].pos.roomName
        }
    }

}
