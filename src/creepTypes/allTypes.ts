export class allCreepTypes {
    static level1Types = {
        GeneralHand: {
            string: "GeneralHand",
            priority: 3,
            creepAmmount: {
                1: 6,
                2: 6,
                3: 6,
                4: 6,
                5: 5,
                6: 4,
                7: 4,
                8: 4
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

        Miner: {
            string: "Miner",
            priority: 2,
            creepAmmount: (function ye(Room: Room) {
                var output = 0;
                Room.memory.src.forEach(function (src) {
                    if (src.contnr != undefined) {
                        output++;
                    }
                })
                return output
            }),
            body: function (energy: number): BodyArray {
                if (energy <= 450) {
                    energy = 300
                } else if (energy >= 600) {
                    energy = 600
                }
                const Minerdefaults = {
                    300: [WORK, WORK, MOVE],
                    500: [WORK, WORK, WORK, WORK, MOVE],
                    550: [WORK, WORK, WORK, WORK, WORK, MOVE],
                    600: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                }
                return Minerdefaults[energy]
            }
        },
        Builder: {
            string: "Builder",
            priority: 4,
            creepAmmount: null,
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
        Lorry: {
            string: "Lorry",
            priority: 4,
            creepAmmount: null,
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
}
