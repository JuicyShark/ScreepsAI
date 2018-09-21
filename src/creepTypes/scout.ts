import { Tasks } from '../TaskManager/Tasks'


export class Scout {

    static newTask(creep: Creep) {

        if (creep.memory.destination != undefined && creep.room.name != creep.memory.destination) {
            creep.task = Tasks.goToRoom(creep.memory.destination)
        } else if (creep.room.name == creep.memory.destination) {
            if (creep.pos != Game.rooms[creep.memory.destination].flags["Scout"].pos) {
                creep.task = Tasks.goTo(Game.rooms[creep.memory.destination].flags["Scout"])
            }
        }
    }

}
