import { nameGen } from "utils/personality/nameGen";
StructureSpawn.prototype.spawnNewCreep = function (spawnTask: spawnTask): void {

    let newName = nameGen(spawnTask.type);
    var testCreep = this.spawnCreep(spawnTask.body, newName, {
        dryRun: true
    });
    if (testCreep == 0) {
        this.spawnCreep(spawnTask.body, newName + Game.time, {
            memory: {
                type: spawnTask.type,
                home: spawnTask.Destination
            }
        });
        console.log("Spawning a " + spawnTask.type + ", named " + newName);

        this.room.spawnList.splice(0)

    } else if (this.spawning) {
        console.log("Spawning " + newName);
    } else {

        console.log("Spawn waiting with " + spawnTask.type)

    }
};

StructureSpawn.prototype.addToQue = function (newRoomTask: spawnTask): Boolean {


    let roomSpawnQue = Game.rooms[newRoomTask.CreatedBy].spawnList;
    let body = newRoomTask.body;


    if (!body || body == null) {
        body = ["move", "carry", "work"]
    }

    var duplicateTask: Boolean = null;
    let overide: Boolean = false;


    if (duplicateTask) {
        return false
    }
    if (roomSpawnQue.length == 0) {
        roomSpawnQue.push(newRoomTask)
        duplicateTask = true;
        overide = true;
    }

    roomSpawnQue.forEach(function (spawnPending: spawnTask, index: number, array: any[]) {

        if (spawnPending.type == newRoomTask.type) {
            duplicateTask = true;
        }


    });

    if (overide == true) {
        return true;
    }

    if (duplicateTask == undefined || duplicateTask == null) {
        roomSpawnQue.push(newRoomTask)
        return true;
    }


}

export class SpawnBrain {





}
