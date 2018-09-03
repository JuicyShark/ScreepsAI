import { Tasks } from '../taskManager/Tasks'


export class RoleLorry {


    static newTask(creep: Creep): void {
        if (creep.memory.task != null || creep.memory.task != undefined) {
            if (creep.carry.energy < creep.carryCapacity || creep.carry.energy != creep.carryCapacity) {
                // Harvest from an empty source if there is one, else pick any source
                let floorStuff = creep.room.find(FIND_DROPPED_RESOURCES);
                let unattendedSource = _.filter(floorStuff, floorStuff => floorStuff.targetedBy.length == 0)[0];
                if (unattendedSource != null) {
                    creep.task = Tasks.pickup(unattendedSource);
                } else {/*
                    let structs = creep.room.find(FIND_MY_STRUCTURES,
                        {filter: {structureType: "extension"}
                    });
                    if (filterdFloor instanceof StructureExtension) {
                        creep.task = Tasks.withdraw(filterdFloor);
                    }
                */}
            }
            else {
                let spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                if (spawn != undefined) {
                    creep.task = Tasks.transfer(spawn);
                }
            }
        }
    }

}
