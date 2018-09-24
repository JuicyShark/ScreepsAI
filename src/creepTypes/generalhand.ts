import { Tasks } from '../TaskManager/Tasks'
import { Builder } from './builder';
import { roomTypes } from 'config';


export class GeneralHand {

    static depositTask(creep: Creep, thisCreepsTasks: any): any {
        let storage: StructureStorage | undefined = creep.room.storage;
        let towers: StructureTower[] | undefined = creep.room.towers
        let spawn = Game.rooms[creep.memory.home].spawns[0];
        let extensions = creep.room.extensions;
        if (spawn.energy != spawn.energyCapacity) {
            thisCreepsTasks.push(Tasks.transfer(spawn));
            return thisCreepsTasks
        }
        else if (spawn.room.energyAvailable != spawn.room.energyCapacityAvailable) {

            if (extensions.length != 0) {
                let temp: any = undefined;
                for (let i in extensions) {
                    if (extensions[i].energy != extensions[i].energyCapacity && extensions[i].targetedBy.length == 0) {
                        temp = extensions[i];
                        break;
                    }
                }
                if (temp != undefined) {
                    thisCreepsTasks.push(Tasks.transfer(temp));
                    return thisCreepsTasks
                }
            }
            else if (storage != undefined) {
                thisCreepsTasks.push(Tasks.transfer(storage));
                return thisCreepsTasks

            }

        }
        else {
            var repairables = creep.room.repairables;
            var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s: Structure) => s.hits < s.hitsMax && s.structureType != STRUCTURE_ROAD });
            var repairMe: Structure<StructureConstant> | null;

            //If you have no Upgraders targeting the upgrader  the harvester will do so.
            if (creep.room.controller.targetedBy.length <= 1 && creep.room.creepsByType.Upgrader == undefined) {
                thisCreepsTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))
                return thisCreepsTasks
            }

            else if (towers != undefined && towers[0].energy != (towers[0].energyCapacity - 1)) {
                let temp1: any = undefined;
                for (let ii = 0; ii < towers.length; ii++) {
                    let thisTower = towers[ii];
                    if (thisTower.energy < thisTower.energyCapacity) {
                        temp1 = thisTower;
                        break;
                    }
                }
                if (temp1 != undefined) {
                    thisCreepsTasks.push(Tasks.transfer(temp1));
                    return thisCreepsTasks

                }
            }
        }

    }
    static harvestTask(creep: Creep, thisCreepsTasks: any): void {

        if (creep.room.droppedEnergy.length != 0 && creep.room.droppedEnergy[0].amount >= creep.carryCapacity) {
            thisCreepsTasks.push(Tasks.pickup(creep.room.droppedEnergy[0]))

        } else {



            //looks for Container with 200 Energy or more and with no more than 2 creeps (including miner)
            var minerContainer = _.filter(creep.room.containers, container => container.energy > (creep.carryCapacity * 2))[0];
            //if it is null
            if (minerContainer == null) {
                //Find a source with no more than 3 creeps harvesting -- hard cap so source doesnt get overloaded.
                let unattendedSource = _.filter(creep.room.sources, source => source.hasContainer() == false);
                if (unattendedSource[0]) {
                    thisCreepsTasks.push(Tasks.harvest(unattendedSource[0]));
                    //this.depositTask(creep, thisCreepsTasks)
                }
            }
            else {
                //or take it from the container
                thisCreepsTasks.push(Tasks.withdraw(minerContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy))
                //this.depositTask(creep, thisCreepsTasks)
            }
        }
    }



    static newTask(creep: Creep): void {
        let thisCreepsTasks: any = []

        if (creep.carry.energy == 0) {
            this.harvestTask(creep, thisCreepsTasks)
        }
        else if (creep.carry.energy != 0 || creep.carry.energy == creep.carryCapacity) {
            this.depositTask(creep, thisCreepsTasks)
        }


        if (thisCreepsTasks.length >= 1) {
            creep.task = Tasks.chain(thisCreepsTasks)
        }
        else {
            Builder.buildOrder(creep, thisCreepsTasks)
            creep.task = thisCreepsTasks[0]
        }
    }
}
