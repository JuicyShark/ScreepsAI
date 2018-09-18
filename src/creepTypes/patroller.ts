import { Tasks } from '../TaskManager/Tasks'


export class Patroller {

    static newTask(creep: Creep) {

        if (creep.room.hostiles != undefined || creep.room.hostiles.length >= 1) {
            creep.task = Tasks.attack(creep.room.hostiles[0])
        }

        let flags = _.values(Game.flags);
        var selectedFlags: Flag[] = [];

        flags.forEach(function (flag: Flag, index: number, array: {}[]) {
            if (flag.name == "Patroll") {
                selectedFlags.push(flag);
            }
            else if (flag.name == "Patroll1") {
                selectedFlags.push(flag);
            }
        })

        let tasks = _.map(selectedFlags, flag => Tasks.goTo(flag));
        creep.task = Tasks.chain(tasks);
    }

}
