import { nameGen } from "utils/personality/nameGen";

export class SpawnTask {

  CreatedBy: string;
  type: string;
  body: string[];
  memory: any;

  constructor(CreatedBy: string, type: string, body: string[]) {
    this.CreatedBy = CreatedBy;
    this.type = type;
    this.body = body;
    this.memory = {
      type: type,
      home: CreatedBy
    };
  }
}


StructureSpawn.prototype.spawnNewCreep = function (spawnTask: SpawnTask): void {

  let newName = nameGen(spawnTask.type);
  var testCreep = this.spawnCreep(spawnTask.body, newName, {
    dryRun: true
  });

  if (testCreep == 0) {

    this.spawnCreep(spawnTask.body, newName + Game.time, { memory: spawnTask.memory });

    this.room.memLog = ("Spawning a " + spawnTask.type + ", named " + newName);
  }
};



//StructureSpawn.prototype.



/*
StructureSpawn.prototype.addToQue = function (newRoomTask: spawnTask): Boolean {
  let roomSpawnQue = Game.rooms[newRoomTask.CreatedBy].spawnList;
  let body = newRoomTask.body;
  if (!body || body === null) {
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
}*/
export class SpawnBrain {

}
