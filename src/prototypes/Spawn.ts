
import { tempGeneralCreepsMAX } from "config"
//import { RoomTask } from "../prototypes/Room"

export class SpawnTask {

  roomName: string;
  type: string;
  creepName: string;
  body: BodyPartConstant[];
  memory: any;

  constructor(roomName: string, type: string, body: BodyPartConstant[], creepName: string, options = {} as any) {
    this.roomName = roomName;
    this.type = type;
    this.creepName = creepName;
    this.body = body;


    if (options == null) {
      this.memory = {
        type: type,
        home: roomName,
        destination: null
      };
    }
    else {
      this.memory = {
        type: type,
        home: roomName,
        destination: options.destination,
        myContainer: options.myContainer,
        mySource: options.mySource
      };
    }
  };

  spawnNewCreep(spawn: StructureSpawn): number {
    var testCreep: number = spawn.spawnCreep(this.body, this.creepName, {
      dryRun: true
    });

    /*if (testCreep == 0) {
      this.room.spawns[0].spawnCreep(spawnTask.body, newName + Game.time, { memory: spawnTask.memory });
      this.room.memLog = ("Spawning a " + spawnTask.type + ", named " + newName);
    }*/


    return testCreep

  }
}


StructureSpawn.prototype.spawnNewCreep = function (spawnTask: SpawnTask): number {

  var testCreep: number = this.spawnCreep(spawnTask.body, spawnTask.creepName, {
    dryRun: true
  });

  if (testCreep == 0) {
    this.spawnCreep(spawnTask.body, spawnTask.creepName + Game.time, { memory: spawnTask.memory });
    this.room.memLog = ("Spawning a " + spawnTask.type + ", named " + spawnTask.creepName);
  }
  return testCreep
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




  /**
   * creepBuilder takes the following and creates a new RoomTask
   *  @param type String
   *  @param room Room
   *  @param options SpawnMemOptions
   *  @returns void - Produces RoomTask in the Room specified
   *
   */

  /*static creepBuilder(Colony: Colony, type: string, room: Room, opts: spawnTaskMemOpts | null): void {
    var spawnerTask: null | SpawnTask = null;

    let defaultBod: string[] = creepBodySizes(type, room)
    spawnerTask = new SpawnTask(room.name, type, defaultBod, opts);
    var roomTask: RTask | null;
    if (type != undefined) {
      //if Type is not undefined then do the do
      let taskName = Game.time + " SpawnTask"
      //roomTask = new RoomTask(taskName, "SpawnTask", creepPriority(type), spawnerTask)

    }

    if (roomTask != undefined || roomTask != null) {
      //create the roomTask

      //Colony.roomTaskDupe(roomTask)
      //room.taskList = roomTask;
    }


  }

  static spawnForHub(Colony: Colony) {
    var room = Colony.room
    var c = Colony.creepsByType

    if (room.creeps.length == 0) {
      SpawnBrain.creepBuilder(Colony, "GeneralHand", room, null)
    }
    if (c.GeneralHand == undefined || c.GeneralHand.length < (tempGeneralCreepsMAX[room.controller.level])) {
      SpawnBrain.creepBuilder(Colony, "GeneralHand", room, null)
    }
    if (c.Miner == undefined || c.Miner.length <= (room.sources.length - 1)) {
      room.sources.forEach(function (source: Source, index: number) {
        if (source.hasContainer() != false && source.hasMiner() == false) {
          var ContainerID = source.hasContainer().id
          var MinerA: Creep | undefined = source.pos.findClosestByLimitedRange(room.creepsByType.Miner, 2)

          if (MinerA == undefined || index != c.Miner.length && room.spawns[0].spawning == null) {
            let opts = {
              destination: null,
              myContainer: ContainerID,
              mySource: source.id
            }
            SpawnBrain.creepBuilder(Colony, "Miner", room, opts)
          }
        }
      })
    }
    if (c.Builder == undefined || c.Builder != undefined && room.constructionSites.length >= 2 && c.Builder.length <= 2) {
      SpawnBrain.creepBuilder(Colony, "Builder", room, null)
    }
    if (room.controller.level >= 2) {
      if (c.Upgrader == undefined || c.Upgrader != undefined && c.Upgrader.length <= 1) {
        SpawnBrain.creepBuilder(Colony, "Upgrader", room, null)
      }
    }





  }*/

  static spawnForFlags(Colony): void {
    var c = Colony.creepsByType
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
    /*  var FoundFlag: Boolean | null = null;
      if (PatrollerFlag != null && PatrollerFlag.length >= 1 && c.Patroller == undefined || c.Patroller != undefined && c.Patroller.length <= 3) {
        SpawnBrain.creepBuilder(Colony, "Patroller", room, null)
      }

      if (ScoutFlag != null && ScoutFlag.length >= 1 && c.Scout == null || c.scout != undefined && c.Scout.length == 0) {

        SpawnBrain.creepBuilder(Colony, "Scout", room, null)
      }*/

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
        SpawnBrain.creepBuilder(Colony, "Miner", room, opts)
      }
    })
  })

}*/
  }

  private static creepMetaBuilder(creepType: string) {

  }


}
