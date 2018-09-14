import { Tasks } from '../TaskManager/Tasks'


export class Harvester {

    static newTask(creep: Creep): void {

        if (creep.carry.energy == 0) {
            var unattendedContainer = _.filter(creep.room.containers, container => container.isEmpty != true && container.targetedBy.length <= 1)[0];
            if (unattendedContainer == null) {
                let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 1)[0];
                if (!(!unattendedSource)) {
                    creep.task = Tasks.harvest(unattendedSource)
                } else {
                    let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 2)[0];
                    creep.task = Tasks.harvest(unattendedSource)
                }

            }
            else {
                creep.task = Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy)
            }
        }
        else if (creep.carry.energy == creep.carryCapacity) {
            let spawn = Game.rooms[creep.memory.home].spawns[0];

            if (spawn.energy != spawn.energyCapacity) {
                creep.task = Tasks.transfer(spawn);
            }
            else {
                if (creep.room.controller.targetedBy.length == 0) {
                    creep.task = Tasks.upgrade(Game.rooms[creep.memory.home].controller)
                }

                let storage = creep.room.storage;
                let extensions = creep.room.extensions;
                if (storage != undefined) {
                    creep.task = Tasks.transfer(storage);
                }
                else if (extensions.length != 0) {

                    for (let i in extensions) {

                        if (extensions[i].energy != extensions[i].energyCapacity) {

                            creep.task = Tasks.transfer(extensions[i]);
                            break;
                        }
                    }
                }
            }


        }
    }

}
