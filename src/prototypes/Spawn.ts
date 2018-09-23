import { nameGen } from "utils/personality/nameGen";
import { creepBodySizes, creepPriority, tempGeneralCreepsMAX } from "config"

export class SpawnTask {

  CreatedBy: string;
  type: string;
  body: string[];
  memory: any;

  constructor(CreatedBy: string, type: string, body: string[], options: spawnTaskMemOpts | null) {
    this.CreatedBy = CreatedBy;
    this.type = type;
    this.body = body;
    if (options == null) {
      this.memory = {
        type: type,
        home: CreatedBy,
        destination: null
      };
    }
    else {
      this.memory = {
        type: type,
        home: CreatedBy,
        destination: options.destination,
        myContainer: options.myContainer
      };
    }
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

  static thisColony(room: Room) {
    if (Game.colonies == undefined || Game.colonies.length == 0) {
      return
    }
    else {
      //let output: | undefined;
      for (let i in Game.colonies) {
        if (Game.colonies[i].name == room.name) {
          return Game.colonies[i]
        }
        else {
          if (Game.colonies[i].outposts.length != 0) {
            for (let ii in Game.colonies[i].outposts) {
              if (room.name == Game.colonies[i].outposts[ii].name) {
                return Game.colonies[i];
              }
            }
          }
        }
      }
    }
  }

  private static creepTypesDef(room: Room): any {
    var creepTypesAlive = {
      generalCreeps: this.thisColony(room).creepsByType.GeneralHand,
      upgraders: this.thisColony(room).creepsByType.Upgrader,
      builders: this.thisColony(room).creepsByType.Builder,
      miners: this.thisColony(room).creepsByType.Miner,
      lorrys: this.thisColony(room).creepsByType.Lorry,
      patrollers: this.thisColony(room).creepsByType.Patroller,
      scout: this.thisColony(room).creepsByType.Scout,
    }
    return creepTypesAlive

  }

  private static ContainerMiners(room: Room, c: any): void {

    if (room.containers.length != 0 && c.miners == undefined || room.containers.length != 0 && c.miners.length <= (room.sources.length - 1)) {
      room.sources.forEach(function (source: Source, index: number, array: Source[]) {
        if (source.hasContainer() == true) {
          let Container = source.pos.findClosestByLimitedRange(room.containers, 2)
          let Miner: Creep | undefined = source.pos.findClosestByLimitedRange(room.creepsByType.Miner, 1)

          if (Miner == undefined && room.creepsByType.Miner.length != index) {
            let ContainerID = source.pos.findClosestByLimitedRange(room.containers, 2).id
            let STMO: spawnTaskMemOpts = {
              destination: null,
              myContainer: ContainerID
            }
            SpawnBrain.creepBuilder("Miner", room, STMO)
          }
        }
      })
    }
  }

  static creepBuilder(type: string, room: Room, options: spawnTaskMemOpts | null): void {
    var spawnerTask: null | SpawnTask = null;

    let defaultBod: string[] = creepBodySizes(type, room)
    spawnerTask = new SpawnTask(room.name, type, defaultBod, options);

    if (type != undefined) {
      //if Type is not undefined then do the do
      let roomTask: RoomTask = {
        name: (Game.time + "SpawnTask"),
        roomOrder: "SpawnTask",
        priority: creepPriority(type),
        details: spawnerTask
      }

      if (roomTask != undefined || roomTask != null) {
        //create the roomTask
        room.createRoomTask(roomTask)
      }

    }

  }

  static spawnListChecker(room: Room) {
    var c = this.creepTypesDef(room)
    var ScoutFlag: Flag[] | null = null;
    var PatrollerFlag: Flag[] | null = null;
    var roomFlags = Object.values(Game.flags).forEach(function (flag: Flag, index: number) {
      if (flag.name == "Patroll" && flag.room.name == room.name || flag.name == "Patroll1" && flag.room.name == room.name) {
        if (PatrollerFlag != null && PatrollerFlag.length >= 1) {
          let found: true | null = null;
          PatrollerFlag.forEach(function (flagi) { if (flagi.name == flag.name) { found = true } })
          if (found == null) {
            PatrollerFlag.push(flag);
          }
        } else {
          PatrollerFlag.push(flag);
        }
      }
      else if (flag.name == "Scout") {
        if (ScoutFlag != null && ScoutFlag.length >= 1) {
          let found: true | null = null;
          ScoutFlag.forEach(function (flagi) { if (flagi.name == flag.name) { found = true } })
          if (found == null) {
            ScoutFlag.push(flag);
          }
        } else {
          ScoutFlag = [];
          ScoutFlag.push(flag);
        }
      }
    })
    var FoundFlag: Boolean | null = null;

    if (room.creeps.length == 0) {
      SpawnBrain.creepBuilder("GeneralHand", room, null)
    }
    else if (c.generalCreeps == undefined || c.generalCreeps.length < (tempGeneralCreepsMAX[room.controller.level])) {
      this.ContainerMiners(room, c)
      SpawnBrain.creepBuilder("GeneralHand", room, null)
    }
    else if (c.builders == undefined || c.builders != undefined && c.builders.length < (room.controller.level / 2)) {
      SpawnBrain.creepBuilder("Builder", room, null)
    }
    else {

      if (room.controller.level >= 3) {
        if (c.upgraders == undefined || c.upgraders != undefined && c.upgraders.length < (room.controller.level / 2)) {
          SpawnBrain.creepBuilder("Upgrader", room, null)
        }
      }

    }

    if (PatrollerFlag != null && PatrollerFlag.length >= 1 && c.patrollers == undefined || c.patrollers != undefined && c.patrollers.length <= 3) {
      SpawnBrain.creepBuilder("Patroller", room, null)
    }

    if (ScoutFlag != null && ScoutFlag.length >= 1 && c.scout == null || c.scout != undefined && c.scout.length <= 1) {
      let ScoutingNeeded = ScoutFlag.pop().pos.roomName;

      /*SpawnBrain.creepBuilder("Scout", room, {
        destination: ScoutingNeeded,
        myContainer: null
      })*/
    }


  }


}
