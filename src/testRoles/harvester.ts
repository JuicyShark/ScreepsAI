import { Tasks } from '../TaskManager/Tasks'

export class RoleHarvester {

    // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
    // This module demonstrates the RoomObject.targetedBy functionality
    static newTask(creep: Creep): void {
        if (creep.carry.energy < creep.carryCapacity || creep.carry.energy != creep.carryCapacity) {
            // Harvest from an empty source if there is one, else pick any source
            let sources = creep.room.find(FIND_SOURCES);
            let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
            if (unattendedSource != null) {
                creep.task = Tasks.harvest(unattendedSource);
            } else {
                creep.task = Tasks.harvest(sources[0]);
            }
        } else {
            let spawn = Memory.Colonies.ColonyRoom[creep.pos.roomName].structureIDs.Spawns[0];
            if (spawn != undefined) {
                creep.task = Tasks.transfer(spawn);
            }
            else { }
        }
    }

}
