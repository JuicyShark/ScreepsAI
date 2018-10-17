import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { creepTypes } from 'config';
import { SpawnTask } from '../prototypes/Spawn'

export class Spawner {

    static createBody(type: string, room: Room): string[] {
        var energy = room.energyCapacityAvailable
        if (room.creeps.length <= 5) {
            if (room.energyAvailable > (room.energyCapacityAvailable - room.energyAvailable)) {
                energy = room.energyAvailable
            }
            else {
                energy = 300;
            }
        }
        else {
            energy = room.energyCapacityAvailable;
        }
        //creating a balanced body
        if (type == "GeneralHand" || type == "Upgrader" || type == "Builder") {
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

        if (type == "Miner") {
            let bodyReturn = function (energy): number {
                if (energy <= 500) {
                    return 300
                } else if (energy >= 750) {
                    return 750
                } else {
                    return energy
                }
            }
            let Minerdefaults = {
                300: [WORK, WORK, MOVE],
                500: [WORK, WORK, WORK, WORK, MOVE],
                550: [WORK, WORK, WORK, WORK, WORK, MOVE],
                600: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                650: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                700: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                750: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
            }

            body = Minerdefaults[bodyReturn(energy)]

            return body;
        }
        if (type == "Scout") {
            body = ["move"]
            return body;
        }
        if (type == "Patroller") {
            if (energy >= 300) {
                energy = 300
            }
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
        if (type == "Lorry") {
            var numberOfParts = Math.floor(energy / 100);
            numberOfParts = Math.min(numberOfParts, Math.floor(100 / 2));
            for (let i = 0; i < numberOfParts; i++) {
                body.push("carry");
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push("move");
            }
            return body;

        }
        if (type == "Attacker") {
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
        if (type == "Defender") {
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


    static newRoomTask(Colong: Colony, room: Room): void {

        /* if (room.creeps.length == 0) {
             let type = "GeneralHand"
             let opts = null;
             let defaultBod: any = this.createBody(type, room)
             var spawnTask = new SpawnTask(room, type, defaultBod, opts);
             let roomTaskData = {
                 room: room,
                 creeps: room.creeps,
                 data: spawnTask
             }
 
             room.RoomTask = Room_Tasks.spawnCreeps(Colony, roomTaskData as SpawnTaskData)
         }*/

    }

}
