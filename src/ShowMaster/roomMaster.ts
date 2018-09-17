import * as creepMaster from '../ShowMaster/creepMaster';
import { getCacheExpiration, derefRoomPosition } from '../utils/helperFunctions';
import { Colony } from '../Colony'
import { configCreepTypes, creepTypes, roomTypes } from 'config'
import { ConversationStarter } from '../utils/personality/creepConversation'

export function handleMyRoom(room: Room) {
  if (!Memory.username) {
    Memory.username = room.controller.owner.username;
  }
  room.memory.lastSeen = Game.time;
  if (!room.memory.queue) {
    room.memory.queue = [];
  }

  return room.executeRoom();

}

export function handleExternalRoom(room: Room) {
  if (!this.controller) {
    const nameSplit = this.splitRoomName();
    if (nameSplit[2] % 10 === 0 || nameSplit[4] % 10 === 0) {
      return this.handleExternalHighwayRoom();
    }
  } else {
    if (this.controller.owner) {
      return this.handleOccupiedRoom();
    }
    if (this.controller.reservation && this.controller.reservation.username === Memory.username) {
      return this.handleReservedRoom();
    }
  }
  if (this.controller && !this.controller.reservation) {
    if (this.handleUnreservedRoom()) {
      return false;
    }
  }
}


export function delegateToSpawns(colony: Colony): void {
  // Separate creeps by role
  var harvesters: Creep[] | undefined = colony.creepsByType.Harvester;
  var upgraders: Creep[] | undefined = colony.creepsByType.Upgrader;
  var builders: Creep[] | undefined = colony.creepsByType.Builder;
  var lorrys: Creep[] | undefined = colony.creepsByType.Lorry;
  //let patrollers: Creep[] | undefined = colony.creepsByRole.Patroller;
  let spawn: StructureSpawn | null = colony.room.spawns[0];
  // Spawn creeps as needed
}


const RECACHE_TIME = 2500;
const OWNED_RECACHE_TIME = 1000;
export class RoomBrain {
  //takes 3 inputs/nullnull



  /* Records all info for permanent room objects, e.g. sources, controllers, etc. */
  private static recordPermanentObjects(room: Room): void {
    let savedSources: SavedSource[] = [];
    //console.log(`${room.sources}`)
    for (let source of room.sources) {
      let container = source.pos.findClosestByLimitedRange(room.containers, 2);
      let miners: boolean | undefined;
      if (source.pos.findClosestByLimitedRange(room.creepsByType.Miner, 2)) {
        miners = true
      } else {
        miners = undefined
      }
      //console.log(`${container}`)
      savedSources.push({
        c: source.id,
        contnr: container ? container.pos.coordName : undefined,
        miner: miners

      });
    }
    room.memory.src = savedSources;
    room.memory.ctrl = room.controller ? {
      c: room.controller.pos.coordName,
      level: room.controller.level,
      owner: room.controller.owner ? room.controller.owner.username : undefined,
      res: room.controller.reservation,
      SM: room.controller.safeMode,
      SMavail: room.controller.safeModeAvailable,
      SMcd: room.controller.safeModeCooldown,
      prog: room.controller.progress,
      progTot: room.controller.progressTotal
    } : undefined;
    room.memory.mnrl = room.mineral ? {
      c: room.mineral.pos.coordName,
      density: room.mineral.density,
      mineralType: room.mineral.mineralType
    } : undefined;
    room.memory.SKlairs = _.map(room.keeperLairs, lair => {
      return { c: lair.pos.coordName };
    });
    if (room.controller && room.controller.owner) {
      room.memory.importantStructs = {
        towers: _.map(room.towers, t => t.pos.coordName),
        spawns: _.map(room.spawns, s => s.pos.coordName),
        storage: room.storage ? room.storage.pos.coordName : undefined,
        terminal: room.terminal ? room.terminal.pos.coordName : undefined,
        walls: _.map(room.walls, w => w.pos.coordName),
        ramparts: _.map(room.ramparts, r => r.pos.coordName),
      };
    } else {
      room.memory.importantStructs = undefined;
    }
    room.memory.tick = Game.time;

  }

  static runTimer(Colony: Colony): void {
    var room: Room = Colony.room

    if (room.hostiles != undefined && room.hostiles.length >= 1) {
      console.log(JSON.stringify(room.hostiles))
    }


    if (!room.memory.timer || room.memory.timer == 0) {
      room.memory.timer = 60;
    }

    //needAlertLevelLogic

    if (room.memory.timer % 12 === 0) {
      //checking for type of room
      for (let i in roomTypes) {
        if (room.roomType == roomTypes[i]) {
          this.runType(room, roomTypes[i])
        }
      }

    }
    if (room.memory.timer % 9 === 0) {
      this.spawnTaskChecker(room)
    }
    //do things every roomTick
    // console.log("Current spawnList :" + "===" + JSON.stringify(room.spawnList, null, " ") + "====")
    creepMaster.runCreeps()


    console.log(room.name + " Timer: " + room.memory.timer)
    room.memory.timer--
  }

  static roomReservedBy(roomName: string): string | undefined {
    if (Memory.rooms[roomName] && Memory.rooms[roomName].ctrl && Memory.rooms[roomName].ctrl!.res) {
      if (Game.time - (Memory.rooms[roomName].tick || 0) < 10000) { // reservation expires after 10k ticks
        return Memory.rooms[roomName].ctrl!.res!.username;
      }

    }
  }


  static spawnTaskChecker(room: Room) {
    if (room.energyAvailable == room.energyCapacityAvailable) {
      for (let i in room.spawns) {
        if (room.spawns[i] instanceof StructureSpawn) {
          var isSpawning = room.spawns[i].spawning;
          if (isSpawning == null || isSpawning == undefined) {
            if (room.spawnList != undefined && room.spawnList.length != 0) {
              let spawnTask: spawnTask = Object.entries(room.spawnList)[0][1]
              room.spawns[i].spawnNewCreep(spawnTask)
              break;

            }
            else if (room.spawnList != undefined && room.spawnList.length == 0) {
              // console.log("hello, im a free spawn!! :D")
            }
          }
        }
      }
    }
  }


  static spawnerGo(room: Room): void {
    var defaultBod = ["work", "carry", "move"];
    var thisColony = function (): Colony {

      if (Game.colonies == undefined || Game.colonies.length == 0) {
        return
      }
      else {
        //let output: | undefined;
        for (let i in Game.colonies) {
          if (Game.colonies[i].name == room.name) {
            return Game.colonies[i]
          }

        }
      }

    }

    //madeToOrder Will take anything that isnt "" or undefined including lowerCase thangs
    function madeToOrder(type: string, room: Room, opts: any | null): void {
      if (type != undefined) {
        var spawnTask: spawnTask = {
          gameTime: Game.time,
          type: type,
          body: defaultBod,
          Destination: room.name,
          CreatedBy: room.name,
          memory: null
        }
        if (opts != null) {

        }
        if (type == "Miner") {
          spawnTask.memory = opts.memory
          spawnTask.body = ["move", "work", "work"]
        }

      }
      //here we check to see if the type is an actual type ready for deployment. (in the config file)
      if (type == configCreepTypes(type)) {
        spawnTask.type = type;
        spawnTask.Destination = room.name;
      }
      if (spawnTask != undefined) {
        //Pushes the spawnTask to the que
        room.spawns[0].addToQue(spawnTask)
      }

    }
  }

    var harvesters: Creep[] | undefined = thisColony().creepsByType.Harvester
var upgraders: Creep[] | undefined = thisColony().creepsByType.Upgrader
var builders: Creep[] | undefined = thisColony().creepsByType.Builder
var containerMiner: Creep[] | undefined = thisColony().creepsByType.Miner

if (room.creeps.length == 0 || harvesters == undefined) {
  madeToOrder("Harvester", room, null)
}

if (harvesters != undefined && harvesters.length < room.sources.length) {
  madeToOrder("Harvester", room, null)
}
if (upgraders == undefined || upgraders.length < room.controller.level) {
  madeToOrder("Upgrader", room, null)
}
if (room.containers.length != 0) {
  if (room.containers[0].targetedBy.length >= 1) {

  }
  room.sources.forEach(function (source: Source, index: number, array: Source[]) {
    if (source.hasContainer() == true) {
      let Container = source.pos.findClosestByLimitedRange(room.containers, 2)
      let Miners: Creep | undefined = source.pos.findClosestByLimitedRange(room.creepsByType.Miner, 1)

      if (Miners == undefined && Container.targetedBy.length <= 1) {
        let ContainerID = source.pos.findClosestByLimitedRange(room.containers, 2).id
        let options = {
          memory: {
            myContainer: ContainerID
          }
        }
        madeToOrder("Miner", room, options)
      }

    }
  })

}

if (builders == undefined || builders.length < 2) {
  madeToOrder("Builder", room, null)
}


    //kodie flesh this out..
  }


  static spawnTaskAssigner(room: Room): void {
  if(room.energyAvailable == room.energyCapacityAvailable) {
  this.spawnerGo(room)
}
  }


  static run(): void {
  for(let name in Game.rooms) {
  const room = Game.rooms[name];
  let roomType = room.roomType

  // Record location of permanent objects in room and recompute score as needed
  if (!room.memory.expiration || Game.time > room.memory.expiration) {
    this.recordPermanentObjects(room);

    // Refresh cache
    let recacheTime = room.owner ? OWNED_RECACHE_TIME : RECACHE_TIME;
    room.memory.expiration = getCacheExpiration(recacheTime, 250);
  }
  if (!room.memLog) {
    room.memLog
  }
  //what else can we put in here?

}
if (harvesters != undefined && harvesters.length < room.sources.length) {
  madeToOrder("Harvester", room, null)
}
if (upgraders == undefined || upgraders.length < 1) {
  madeToOrder("Upgrader", room, null)
}
if (builders == undefined || builders.length < 4) {
  madeToOrder("Builder", room, null)
}
    //kodie flesh this out..
  }

<<<<<<< HEAD
  }

=======
>>>>>>> 10b903d77be50924ad723fa022e8e82ec07f1c1d
  static runType(room: Room, roomType: string) {
  if (roomType == "ColonyHub") {
    this.spawnTaskAssigner(room)
  }
}
<<<<<<< HEAD
=======

  static run(): void {
    for (let name in Game.rooms) {
      const room = Game.rooms[name];
      let roomType = room.roomType
      // Record location of permanent objects in room and recompute score as needed
      if (!room.memory.expiration || Game.time > room.memory.expiration) {
        this.recordPermanentObjects(room);
        // Refresh cache
        let recacheTime = room.owner ? OWNED_RECACHE_TIME : RECACHE_TIME;
        room.memory.expiration = getCacheExpiration(recacheTime, 250);
      }
      //checking for type of room
      for (let i in roomTypes) {
        if (roomType == roomTypes[i]) {
          this.runType(room, roomTypes[i])
        }
      }
      //what else can we put in here?
    }
  }
>>>>>>> 10b903d77be50924ad723fa022e8e82ec07f1c1d
}

