import { nameGen } from "utils/personality/nameGen";
import { creepBodySizes, creepPriority, tempGeneralCreepsMAX } from "config"
import { RoomTask } from "../prototypes/Room"

export class SpawnTask {

  CreatedBy: string;
  type: string;
  body: string[];
  memory: any;

  constructor(CreatedBy: string, type: string, body: string[], options: any) {
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
        myContainer: options.myContainer,
        mySource: options.mySource
      };
    }
  };
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

  /**
   * creepBuilder takes the following and creates a new RoomTask
   *  @param type String
   *  @param room Room
   *  @param options SpawnMemOptions
   *  @returns void - Produces RoomTask in the Room specified
   *
   */

  static creepBuilder(type: string, room: Room, opts: spawnTaskMemOpts | null): void {
    var spawnerTask: null | SpawnTask = null;

    let defaultBod: string[] = creepBodySizes(type, room)
    spawnerTask = new SpawnTask(room.name, type, defaultBod, opts);
    var roomTask: RoomTask | null;
    if (type != undefined) {
      //if Type is not undefined then do the do
      let taskName = Game.time + " SpawnTask"
      roomTask = new RoomTask(taskName, "SpawnTask", creepPriority(type), spawnerTask)

    }

    if (roomTask != undefined || roomTask != null) {
      //create the roomTask
      let colony: Colony = this.thisColony(room)
      colony.roomTaskDupe(roomTask)
      //room.taskList = roomTask;
    }


  }

  static spawnForHub(Colony: Colony) {
    var room = Colony.room
    var c = this.creepTypesDef(room)

    if (room.creeps.length == 0) {
      SpawnBrain.creepBuilder("GeneralHand", room, null)
    }
    if (c.generalCreeps == undefined || c.generalCreeps.length < (tempGeneralCreepsMAX[room.controller.level])) {
      SpawnBrain.creepBuilder("GeneralHand", room, null)
    }
    if (c.miners == undefined || c.miners.length <= (room.sources.length - 1)) {
      room.sources.forEach(function (source: Source, index: number) {
        if (source.hasContainer() != false && source.hasMiner() == false) {
          var ContainerID = source.hasContainer().id
          var Miner: Creep | undefined = source.pos.findClosestByLimitedRange(room.creepsByType.Miner, 2)

          if (Miner == undefined || index != room.creepsByType.Miner.length && room.spawns[0].spawning == null) {
            let opts = {
              destination: null,
              myContainer: ContainerID,
              mySource: source.id
            }
            SpawnBrain.creepBuilder("Miner", room, opts)
          }
        }
      })
    }
    if (c.builders == undefined || c.builders != undefined && room.constructionSites.length >= 2 && c.builders <= 2) {
      SpawnBrain.creepBuilder("Builder", room, null)
    }
    if (room.controller.level >= 2) {
      if (c.upgraders == undefined || c.upgraders != undefined && c.upgraders.length <= 1) {
        SpawnBrain.creepBuilder("Upgrader", room, null)
      }
    }





  }

  static spawnForFlags(Colony): void {
    var c = this.creepTypesDef(room)
    var room = Colony.room
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
    if (PatrollerFlag != null && PatrollerFlag.length >= 1 && c.patrollers == undefined || c.patrollers != undefined && c.patrollers.length <= 3) {
      SpawnBrain.creepBuilder("Patroller", room, null)
    }

    if (ScoutFlag != null && ScoutFlag.length >= 1 && c.scout == null || c.scout != undefined && c.scout.length == 0) {

      SpawnBrain.creepBuilder("Scout", room, null)
    }

  }

  static spawnForOutpost(): void {

    /*if (this.thisColony(room).outposts.length != 0) {
  this.thisColony(room).outposts.forEach(function (outpost: Room) {
    outpost.sources.forEach(function (source) {
      if (source.hasMiner() == false) {
        let opts: spawnTaskMemOpts = {
          destination: outpost.name,
          myContainer: null,
          mySource: source.id

        }
        SpawnBrain.creepBuilder("Miner", room, opts)
      }
    })
  })

}*/
  }


}
