import { nameGen } from "utils/personality/nameGen";
import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { SpawnTask } from '../prototypes/Spawn'

export class roomTypeBase {
    static creepName(type: string): string {
        return nameGen(type)

    }
    static testme(Colony: Colony, room: Room): RTask | null {
        const tempGeneralCreepsMAX = {
            1: 8,
            2: 8,
            3: 7,
            4: 6,
            5: 5,
            6: 5,
            7: 5,
            8: 5
        }
        let spawns = room.spawns;
        let targetSpawns: StructureSpawn[] = [];


        spawns.forEach(function (spawn: StructureSpawn, index: number, array: StructureSpawn[]) {
            if (spawn.spawning == null) {
                targetSpawns.push(spawn);
            }
        })
        if (targetSpawns.length == 0) {
            return null
        } else {
            if (room.creeps.length == 0) {
                let creepsToSpawn: SpawnTask[] = [];
                let type = "GeneralHand"
                let options = {
                    creepLength: 0,
                    creepTarget: 4
                };
                let defaultBod: any = ["move", "carry", "carry", "work"]
                for (let i = 0; i < options.creepTarget; i++) {
                    let temp = new SpawnTask(room.name, type, defaultBod, this.creepName(type));
                    creepsToSpawn.push(temp);
                }

                let roomTaskData = {
                    _colony: Colony,
                    roomName: room.name,
                    spawns: targetSpawns,
                    creeps: {
                        creepsByType: _.groupBy(Colony.creeps, creep => creep.memory.type)
                    },
                    data: creepsToSpawn
                }

                return Room_Tasks.spawnCreeps(Colony, roomTaskData, options)
            }
            else if (room.creeps.length != 0) {
                return this.standardCreepDeployment(Colony, room, targetSpawns)

            }
        }
    }
    static calculate(room: Room, type: string, options): SpawnTask[] | null {

        var creepsToSpawn: SpawnTask[] = [];
        if (options.creepLength == options.creepTarget) {
            return null;
        } else {

            console.log(type + " " + options.creepLength + " " + options.creepTarget)

            let body: any = roomTypeBase.creepTypes[type].body((room.energyCapacityAvailable / 2))
            for (let i = options.creepLength; i < options.creepTarget; i++) {
                let temp = new SpawnTask(room.name, type, body, this.creepName(type));
                creepsToSpawn.push(temp);
            }
            return creepsToSpawn;
        }


    }

    static standardCreepDeployment(Colony: Colony, room: Room, targetSpawns: StructureSpawn[]): RTask | null {



        if (Colony.rooms.length == 1) {


            let creepTypes = roomTypeBase.creepTypes
            let output = null;

            for (let type of Object.values(creepTypes)) {

                if (Colony.creepsByType[type.string] == undefined) {
                    let options = {
                        creepLength: 0,
                        creepTarget: creepTypes[type.string].creepAmmount[room.controller.level]

                    }
                    if (this.calculate(room, type.string, options) == null) {
                        continue;
                    }
                    let creepsToSpawn = this.calculate(room, type.string, options)
                    let roomTaskData = {
                        _colony: Colony,
                        roomName: room.name,
                        spawns: targetSpawns,
                        creeps: {
                            creepsByType: _.groupBy(Colony.creeps, creep => creep.memory.type)
                        },
                        data: creepsToSpawn
                    }
                    output = Room_Tasks.spawnCreeps(Colony, roomTaskData, options)
                    break;

                }
                else if (Colony.creepsByType[type.string] != undefined || Colony.creepsByType[type.string] < type.creepAmmount[room.controller.level]) {
                    let options = {
                        creepLength: Colony.creepsByType[type.string].length,
                        creepTarget: creepTypes[type.string].creepAmmount[room.controller.level]
                    }
                    let creepsToSpawn = this.calculate(room, type.string, options)
                    let roomTaskData = {
                        _colony: Colony,
                        roomName: room.name,
                        spawns: targetSpawns,
                        creeps: {
                            creepsByType: _.groupBy(Colony.creeps, creep => creep.memory.type)
                        },
                        data: creepsToSpawn
                    }
                    output = Room_Tasks.spawnCreeps(Colony, roomTaskData, options)

                    break;
                }
            }

            if (output != null) {
                return output
            }






        }

    }

    static creepTypes = {
        GeneralHand: {
            string: "GeneralHand",
            priority: 3,
            creepAmmount: {
                1: 8,
                2: 8,
                3: 7,
                4: 6,
                5: 5,
                6: 5,
                7: 5,
                8: 5
            },
            body: function (energy: number): BodyArray {
                var numberOfParts = Math.floor(energy / 200);
                numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
                var body: string[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("work");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("carry");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                return body;
            }
        },
        Upgrader: {
            string: "Upgrader",
            priority: 4,
            creepAmmount: {
                1: 0,
                2: 0,
                3: 0,
                4: 1,
                5: 2,
                6: 3,
                7: 3,
                8: 3
            },
            body: function (energy: number): BodyArray {
                var numberOfParts = Math.floor(energy / 200);
                numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
                var body: string[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("work");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("carry");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                return body;
            }
        },
        Builder: {
            string: "Builder",
            priority: 4,
            creepAmmount: {
                1: 0,
                2: 0,
                3: 1,
                4: 1,
                5: 2,
                6: 2,
                7: 2,
                8: 2
            },
            body: function (energy: number): BodyArray {
                var numberOfParts = Math.floor(energy / 200);
                numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
                var body: string[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("work");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("carry");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                return body;
            }
        }

    }

    static level2types = {

        Miner: {
            string: "Miner",
            priority: 2,
            creepAmmount: null,
            body: function (energy: number): BodyArray {
                if (energy <= 500) {
                    energy = 300
                } else if (energy >= 750) {
                    energy = 750
                }
                const Minerdefaults = {
                    300: [WORK, WORK, MOVE],
                    500: [WORK, WORK, WORK, WORK, MOVE],
                    550: [WORK, WORK, WORK, WORK, WORK, MOVE],
                    600: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                    650: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                    700: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                    750: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
                }
                return Minerdefaults[energy]
            }
        },
        Patroller: {
            string: "Patroller",
            priority: 2,
            creepAmmount: null,
            body: function (energy: number): BodyArray {
                var numberOfParts = Math.floor(energy / 150);
                var body: string[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                numberOfParts = Math.floor(energy / 150)
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("attack");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("tough");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("tough");
                }
                return body;

            }
        },
        Lorry: {
            string: "Lorry",
            priority: 4,
            creepAmmount: {
                1: 0,
                2: 0,
                3: 1,
                4: 1,
                5: 2,
                6: 2,
                7: 2,
                8: 2
            },
            body: function (energy: number): BodyArray {
                var numberOfParts = Math.floor(energy / 100);
                var body: string[] = [];
                numberOfParts = Math.min(numberOfParts, Math.floor(100 / 2));
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("carry");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                return body;

            }
        },
        Scout: {
            string: "Scout",
            priority: 5,
            creepAmmount: null,
            body: function (energy: number): BodyArray {
                var numberOfParts = Math.floor(energy / 50);
                var body: string[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                return body;

            }
        },
        Defender: {
            string: "Defender",
            priority: 2,
            creepAmmount: null,
            body: function (energy: number) {
                var numberOfParts = Math.floor(energy / 200);
                var body: string[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                numberOfParts = Math.floor(energy / 200)
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("attack");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("tough");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("tough");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("ranged_attack");
                }
                return body;
            }
        },
        Attacker: {
            string: "Attacker",
            priority: 3,
            creepAmmount: null,
            body: function (energy: number) {
                var numberOfParts = Math.floor(energy / 200);
                var body: string[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("move");
                }
                numberOfParts = Math.floor(energy / 200)
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("attack");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("tough");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("tough");
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push("ranged_attack");
                }
                return body;

            }
        }

    }

    static *spawnGuide() {
        const inside = yield



    }
}
