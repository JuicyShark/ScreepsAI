import { Tasks } from '../TaskManager/Tasks'


export class GeneralHand {

    private static depositTask(creep: Creep, thisCreepsTasks: any): any {
        let spawn = Game.rooms[creep.memory.home].spawns[0];

        if (spawn.energy != spawn.energyCapacity) {
            thisCreepsTasks.push(Tasks.transfer(spawn));
            return thisCreepsTasks
        }
        else if (spawn.room.energyAvailable != spawn.room.energyCapacityAvailable) {
            let extensions = creep.room.extensions;
            if (extensions.length != 0) {
                let temp: any;
                for (let i in extensions) {
                    if (extensions[i].energy != extensions[i].energyCapacity) {
                        temp = extensions[i];
                        break;
                    }
                }
                if (temp != undefined) {
                    thisCreepsTasks.push(Tasks.transfer(temp));
                    return thisCreepsTasks
                }
                else {
                    var repairables = creep.room.repairables;
                    var repairMe: any;
                    if (repairables != undefined) {
                        for (let i = 0; i < repairables.length; i++) {

                            if (repairables[i].structureType == "spawn") {
                                continue;
                            }

                            if (repairables[i].hits < repairables[i].hitsMax && repairables[i].targetedBy.length <= 2) {

                                repairMe = repairables[i];
                                break;
                            }
                        }

                        thisCreepsTasks.push(Tasks.repair(repairMe))
                    }
                }


            }
        }
        else {
            let storage = creep.room.storage;

            //If you have no Upgraders targeting the upgrader  the harvester will do so.
            if (creep.room.controller.targetedBy.length == 0 && creep.room.creepsByType.Upgrader == undefined) {
                thisCreepsTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))
                return thisCreepsTasks
            }


            else if (storage != undefined) {
                thisCreepsTasks.push(Tasks.transfer(storage));
                return thisCreepsTasks

            }
            else {
                thisCreepsTasks.push(Tasks.build(creep.room.constructionSites[0]))
                return thisCreepsTasks
            }
        }
    }
    private static harvestTask(creep: Creep, thisCreepsTasks: any): void {
        //looks for Container with 200 Energy or more and with no more than 2 creeps (including miner)
        var unattendedContainer = _.filter(creep.room.containers, container => container.isEmpty != true && container.energy > 200 && container.targetedBy.length <= 1)[0];
        //if it is null
        if (unattendedContainer == null) {
            //Find a source with no more than 3 creeps harvesting -- hard cap so source doesnt get overloaded.
            let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 2);
            if (!(!unattendedSource[0])) {

                thisCreepsTasks.push(Tasks.harvest(unattendedSource[0]));
                this.depositTask(creep, thisCreepsTasks)
            }

        }
        else {
            //or take it from the container
            thisCreepsTasks.push(Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy))
            this.depositTask(creep, thisCreepsTasks)
        }
    }



    static newTask(creep: Creep): void {
        let thisCreepsTasks: any = []

        if (creep.carry.energy == 0) {
            this.harvestTask(creep, thisCreepsTasks)
        }
        else if (creep.carry.energy == creep.carryCapacity || creep.carry.energy != 0) {
            this.depositTask(creep, thisCreepsTasks)
        }
        creep.task = Tasks.chain(thisCreepsTasks)
    }
}
