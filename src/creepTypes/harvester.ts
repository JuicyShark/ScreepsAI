import { Tasks } from '../TaskManager/Tasks'


export class Harvester {


    private static depositTask(creep: Creep, thisCreepsTasks: any): any {
        let spawn = Game.rooms[creep.memory.home].spawns[0];

        if (spawn.energy != spawn.energyCapacity) {
            return thisCreepsTasks.push(Tasks.transfer(spawn));
        }
        else {
            //If you have no Upgraders targeting the upgrader  the harvester will do so.
            if (creep.room.controller.targetedBy.length == 0) {
                return thisCreepsTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))
            }

            let storage = creep.room.storage;
            let extensions = creep.room.extensions;
            if (storage != undefined) {
                thisCreepsTasks.push(Tasks.transfer(storage));
            }
            else if (extensions.length != 0) {
                let temp: any | undefined;
                for (let i in extensions) {
                    if (extensions[i].energy != extensions[i].energyCapacity) {
                        temp.push(extensions[i])
                        break;
                    }
                }
                if (temp != undefined)
                    return thisCreepsTasks.push(Tasks.transfer(temp));

            }
            else {
                return thisCreepsTasks.push(Tasks.build(creep.room.constructionSites[0]))
            }
        }
    }
    private static harvestTask(creep: Creep, thisCreepsTasks: any): any {
        //looks for Container with 200 Energy or more and with no more than 2 creeps (including miner)
        var unattendedContainer = _.filter(creep.room.containers, container => container.isEmpty != true && container.energy > 200 && container.targetedBy.length <= 1)[0];
        //if it is null
        if (unattendedContainer == null) {
            //Find a source with no more than 3 creeps harvesting -- hard cap so source doesnt get overloaded.
            let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 2);
            if (!(!unattendedSource[0])) {

                return {
                    [thisCreepsTasks.push(Tasks.harvest(unattendedSource[0]))]: [this.depositTask(creep, thisCreepsTasks)]
                }

            }
        }
        else {
            //or take it from the container
            return {
                [thisCreepsTasks.push(Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy))]
                    : [this.depositTask(creep, thisCreepsTasks)]
            }
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

