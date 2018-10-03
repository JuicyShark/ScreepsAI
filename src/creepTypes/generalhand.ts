import { Tasks } from '../TaskManager/Tasks'
import { Builder } from './builder';
import { roomTypes } from 'config';


export class GeneralHand {

    private static harvestStorage(creep: Creep, thisCreepsTasks: any): any {
        let storage: StructureStorage | undefined = creep.room.storage;
        if (storage != undefined && creep.carry.energy == 0 && storage.store.energy >= creep.carryCapacity) {
            thisCreepsTasks.push(Tasks.withdraw(storage));
            return this.deposTower(creep, thisCreepsTasks)

        }
    }

    private static deposTower(creep: Creep, thisCreepsTasks: any): any {
        let towers: StructureTower[] | undefined = creep.room.towers
        if (towers != undefined) {
            var temp1: any = undefined;
            for (let ii = 0; ii < towers.length; ii++) {
                let thisTower = towers[ii];
                if (thisTower.energy < (thisTower.energyCapacity - 100) && thisTower.targetedBy.length == 0) {
                    temp1 = thisTower;
                    break;
                }
                else {
                    continue;
                }
            }
            if (temp1 != undefined) {
                return thisCreepsTasks.push(Tasks.transfer(temp1));
            }
        }
    }
    /** if storage found and not at capacity returns thisCreepsTasks
     *
     */

    private static depositStorage(creep: Creep, thisCreepsTasks: any): any {
        let storage: StructureStorage | undefined = creep.room.storage;
        if (storage != undefined && storage.store.energy <= storage.storeCapacity) {
            thisCreepsTasks.push(Tasks.transfer(storage));
            return thisCreepsTasks

        }
    }
    /**
     * Deposits into extensions that no ones else is targeting as long as they have 50 energy.
     */

    private static depositExtensions(creep: Creep, thisCreepsTasks: any): any {
        let extensions = creep.room.extensions;
        let temp: any = [];
        var carryCount = creep.carry.energy;

        if (extensions.length != 0) {
            extensions.forEach(function (exten, index, array) {
                if (exten.energy != exten.energyCapacity && exten.targetedBy.length == 0) {
                    temp.push(exten)
                }
            })
            for (let i = 0; i < temp.length; i++) {
                if (carryCount <= 49) {
                    break;
                } else {
                    thisCreepsTasks.push(Tasks.transfer(temp[i]))
                    carryCount -= 50
                }
            }
            return thisCreepsTasks
        }

    }

    /**
 * Deposits into the creeps Home room Spawns - havnt tested multiple spawns as of yet but logic is sound?
 */
    private static depositSpawns(creep: Creep, thisCreepsTasks: any): any {
        let spawns = Game.rooms[creep.memory.home].spawns;

        spawns.forEach(function (spawn: StructureSpawn, index: number, array: StructureSpawn[]) {
            if (array.length == 1) {
                if (spawn.energy != spawn.energyCapacity && spawn.targetedBy.length < 2) {
                    thisCreepsTasks.push(Tasks.transfer(spawn));

                }
            }
            else {
                if (spawn.energy != spawn.energyCapacity && spawn.targetedBy.length < 2) {
                    thisCreepsTasks.push(Tasks.transfer(spawn));
                }
            }
        })


        return thisCreepsTasks
    }


    static depositTask(creep: Creep, thisCreepsTasks: any): any {
        let storage: StructureStorage | undefined = creep.room.storage;
        if (creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
            this.depositSpawns(creep, thisCreepsTasks)
            if (thisCreepsTasks.length == 0) {
                this.depositExtensions(creep, thisCreepsTasks)
            }
            return thisCreepsTasks
        }
        else {
            //If you have no Upgraders targeting the upgrader  the harvester will do so.
            if (creep.room.controller.targetedBy.length <= 1 && creep.room.creepsByType.Upgrader == undefined) {
                thisCreepsTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))
                return thisCreepsTasks
            }
            else {
                this.deposTower(creep, thisCreepsTasks)

                if (thisCreepsTasks.length == 0) {
                    this.depositStorage(creep, thisCreepsTasks)
                }
            }
        }

    }
    static harvestTask(creep: Creep, thisCreepsTasks: any): void {

        if (creep.room.droppedEnergy.length != 0 && creep.room.droppedEnergy[0].amount >= (creep.carryCapacity / 2)) {
            thisCreepsTasks.push(Tasks.pickup(creep.room.droppedEnergy[0]))

        } else {



            //looks for Container with 200 Energy or more and with no more than 2 creeps (including miner)
            let miningContainers: StructureContainer[] = [];
            var source = creep.room.sources.forEach(function (source) {
                let anyCon: StructureContainer | undefined = source.pos.findClosestByLimitedRange(creep.room.containers, 1)
                if (anyCon != undefined) {

                    miningContainers.push(anyCon)
                }
            })
            var minerContainer = _.filter(miningContainers, container => container.energy > (creep.carryCapacity * 2))[0];

            //if it is null
            if (minerContainer == null) {
                //Find a source with no more than 3 creeps harvesting -- hard cap so source doesnt get overloaded.
                let unattendedSource = _.filter(creep.room.sources, source => source.hasMiner() == false && source.energy >= 10);
                if (unattendedSource[0]) {
                    thisCreepsTasks.push(Tasks.harvest(unattendedSource[0]));
                    //this.depositTask(creep, thisCreepsTasks)
                }
            }
            else {
                //or take it from the container
                thisCreepsTasks.push(Tasks.withdraw(minerContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy))

            }
        }
    }
    /** Checks creeps energy and does things
     *
     * @param creep Creep
     * @param thisCreepsTasks Array of Tasks
     */
    private static harvesterRun(creep, thisCreepsTasks): any {
        if (creep.carry.energy == 0 || creep.carry.energy <= 49) {
            this.harvestTask(creep, thisCreepsTasks)
        }
        else if (creep.carry.energy != 0 || creep.carry.energy == creep.carryCapacity) {
            this.depositTask(creep, thisCreepsTasks)
        }

        if (thisCreepsTasks.length != 0) {
            return thisCreepsTasks
        } else if (thisCreepsTasks.length == 0) {

        }
    }



    static newTask(creep: Creep): void {
        let thisCreepsTasks: any = []

        this.harvesterRun(creep, thisCreepsTasks)


        if (thisCreepsTasks.length >= 1) {
            creep.task = Tasks.chain(thisCreepsTasks)
        }
        else {
            Builder.buildOrder(creep, thisCreepsTasks)
            creep.task = thisCreepsTasks[0]
        }
    }
}
