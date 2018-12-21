import { Tasks } from '../TaskManager/Tasks'
import { Builder } from './builder';
import { roomTypes } from 'config';


export class GeneralHand {


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
        }
        return thisCreepsTasks
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
    static goToRoomTask(creep: Creep, thisCreepsTasks: any) {
        thisCreepsTasks = Tasks.goToRoom(creep.memory.destination, { blind: true })
        return thisCreepsTasks
    }

    static droppedEnergy(creep: Creep, thisCreepsTasks: any) {
        thisCreepsTasks.push(Tasks.pickup(creep.room.droppedEnergy[0]))
        return thisCreepsTasks
    }

    static upgradeTask(creep: Creep, thisCreepsTasks: any) {
        if (creep.room.creepsByType.Upgrader == undefined) {
            thisCreepsTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))
            return thisCreepsTasks
        }
    }

    static harvestTask(creep: Creep, thisCreepsTasks: any): any {


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
            let unattendedSource = _.filter(creep.room.sources, source => source.hasMiner() == false && source.energy >= 10 && source.targetedBy.length <= 2);
            if (unattendedSource[0]) {
                thisCreepsTasks.push(Tasks.harvest(unattendedSource[0]));
                //this.depositTask(creep, thisCreepsTasks)
            }
            else if (creep.room.storage instanceof StructureStorage && unattendedSource[0] == null && creep.room.storage.store.energy >= (creep.room.storage.storeCapacity / 2)) {
                thisCreepsTasks.push(Tasks.withdraw(creep.room.storage, RESOURCE_ENERGY))

            }
        }
        else {
            //or take it from the container
            thisCreepsTasks.push(Tasks.withdraw(minerContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy))

        }
        return thisCreepsTasks
    }



    static *generalJobGuide(creep: Creep) {

        var storage: StructureStorage | undefined = creep.room.storage;
        var spawns = Game.rooms[creep.room.name].spawns
        var returnMe: outp;
        returnMe = { boolean: true, info: "Starting" }
        yield returnMe

        if (creep.memory.destination != null && creep.memory.destination != creep.room.name) {
            returnMe = { boolean: true, info: "goToRoomTask" }

        } else if (creep.memory.destination == null || creep.memory.destination == creep.room.name) {



            if (creep.carry.energy == 0 || creep.carry.energy <= 49) {
                if (creep.room.droppedEnergy.length != 0 && creep.room.droppedEnergy[0].amount >= (creep.carryCapacity / 5)) {
                    returnMe = { boolean: true, info: "PickupDroppedEnergy" }
                } else {

                    returnMe = { boolean: true, info: "HarvesterTask" }
                }

            } else if (creep.carry.energy == creep.carryCapacity) {
                if (creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
                    var found = false;
                    console.log(JSON.stringify(spawns[0]))
                    if (spawns.length == 1) {
                        let spawn = spawns[0];
                        if (spawn.energy != spawn.energyCapacity && spawn.targetedBy.length < 2) {
                            returnMe = { boolean: true, info: "DepositSpawns" }
                            found = true;
                        }
                    } else if (spawns.length >= 2) {
                        for (let i = 0; i < spawns.length; i++) {
                            if (spawns[i].energy < spawns[i].energyCapacity) {
                                returnMe = { boolean: true, info: "DepositSpawns" }
                                found = true;
                                break;
                            }
                        }

                    } else if (!found && creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
                        returnMe = { boolean: false, info: "DepositSpawns" }

                    } else {
                        returnMe = { boolean: true, info: "UpgradeTask" }
                    }

                }



                if (storage != undefined && storage.store.energy <= storage.storeCapacity) {

                }
            }

        }

        yield returnMe;

    }

    static newTask(creep: Creep): void {
        var thisCreepsTasks: any = []
        const genGo = this.generalJobGuide(creep)

        genGo.next()



        // this.harvesterRun(creep, thisCreepsTasks)
        let value = genGo.next().value as outp;

        switch (value.info) {
            case "PickupDroppedEnergy":
                value.boolean ? this.droppedEnergy(creep, thisCreepsTasks) : null
            case "HarvesterTask":
                value.boolean ? this.harvestTask(creep, thisCreepsTasks) : null
                break;
            case "DepositSpawns":
                value.boolean ? this.depositSpawns(creep, thisCreepsTasks) : this.depositExtensions(creep, thisCreepsTasks)
                break;
            case "goToRoomTask":
                value.boolean ? this.goToRoomTask(creep, thisCreepsTasks) : null
            case "UpgradeTask":
                this.upgradeTask(creep, thisCreepsTasks)
                break;
            case "BuildTask":
                Builder.buildOrder(creep, thisCreepsTasks)
                break;
            default:
                this.upgradeTask(creep, thisCreepsTasks)
                break;
        }

        if (thisCreepsTasks.length >= 2) {
            creep.task = Tasks.chain(thisCreepsTasks)
        }
        else {
            //
            creep.task = thisCreepsTasks[0]
        }

    }
}
