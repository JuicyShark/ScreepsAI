import { Tasks } from '../TaskManager/Tasks'


export class Patroller {

    static newTask(creep: Creep) {

        if (creep.room.hostiles != undefined && creep.room.hostiles.length >= 1) {
            creep.task = Tasks.meleeAttack(creep.room.hostiles[0])
        } else {

            let flags = _.values(Game.flags);
            var selectedFlags: Flag[] = [];

            flags.forEach(function (flag: Flag, index: number, array: {}[]) {
                if (flag.name == "Patroll" || flag.name == "Patroll1") {
                    selectedFlags.push(flag);
                }
            })
            if (creep.pos.findClosestByLimitedRange(flags, 2) == selectedFlags[0]) {
                selectedFlags.shift()
            }
            let tasks = _.map(selectedFlags, flag => Tasks.goTo(flag));
            creep.task = Tasks.chain(tasks);
        }
    }

}
