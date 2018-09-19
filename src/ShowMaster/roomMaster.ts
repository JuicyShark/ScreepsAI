import * as creepMaster from '../ShowMaster/creepMaster';
import { getCacheExpiration, derefRoomPosition } from '../utils/helperFunctions';
import { Colony } from '../Colony'
import { configCreepTypes, creepBodySizes, creepPriority, roomTypes } from 'config'
import { ConversationStarter } from '../utils/personality/creepConversation'
import { SpawnTask } from "../prototypes/Spawn"

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



const RECACHE_TIME = 2500;
const OWNED_RECACHE_TIME = 1000;
export class RoomBrain {
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
        c: source ? source.pos.coordName : undefined,
        contnr: container ? container.pos.coordName : undefined,
        miner: container ? container.hasMiner() : undefined

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
      //room.defend
    }


    if (!room.memory.timer || room.memory.timer == 0) {
      if (room.memory.log.length >= 40) {
        delete room.memory.log;
      }
      room.memory.timer = 60;
    }
    //needAlertLevelLogic

    if (room.memory.timer % 8 === 0) {
      //checking for type of room
      for (let i in roomTypes) {
        if (room.roomType == roomTypes[i]) {
          this.runType(room, roomTypes[i])
        }
      }

    }
    if (room.memory.timer % 9 === 0) {
      room.checkandSpawn()
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


  static spawnerGo(room: Room): void {
    //returns the Colony Obj. Just a hotfixy i hope :D It works for now, bc we have 1 room D:
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
    var generalCreeps: Creep[] | undefined = thisColony().creepsByType.GeneralHand
    var upgraders: Creep[] | undefined = thisColony().creepsByType.Upgrader
    var builders: Creep[] | undefined = thisColony().creepsByType.Builder
    var miners: Creep[] | undefined = thisColony().creepsByType.Miner
    var lorrys: Creep[] | undefined = thisColony().creepsByType.Lorry
    var patrollers: Creep[] | undefined = thisColony().creepsByType.Patroller

    let flags: Flag[] = _.values(Game.flags);
    let patrolFlag: boolean = false;
    let i = 0;
    for (let i = 0; i < flags.length; i++) {
      if (flags[i].name == "Patroll") {
        patrolFlag = true;
      }
    }


    //madeToOrder Will take anything that isnt "" or undefined including lowerCase thangs
    function creepOrder(type: string, room: Room, opts: any | null): void {
      var spawnerTask: null | SpawnTask = null;

      let defaultBod: string[] = creepBodySizes(type, room)
      spawnerTask = new SpawnTask(room.name, type, defaultBod);
      /*{
        CreatedBy: room.name,
        type: type,
        body: defaultBod,
        memory: {
          type: type,
          home: room.name
        }
      }*/

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

    //function for Container Miners bc its alot of messy shit rn
    function ContainerMiners(): void {
      if (room.containers.length != 0 && miners != undefined && miners.length <= (room.sources.length - 1)) {
        if (room.containers[0].targetedBy.length >= 1) {

        }
        room.sources.forEach(function (source: Source, index: number, array: Source[]) {
          if (source.hasContainer() == true) {
            let Container = source.pos.findClosestByLimitedRange(room.containers, 2)
            let Miner: Creep | undefined = source.pos.findClosestByLimitedRange(room.creepsByType.Miner, 1)

            if (Miner == undefined && Container.targetedBy.length <= 1) {
              let ContainerID = source.pos.findClosestByLimitedRange(room.containers, 2).id
              let options = {
                memory: {
                  myContainer: ContainerID
                }
              }
              creepOrder("Miner", room, options)
            }
          }
        })
      }
    }

    if (room.creeps.length == 0 || generalCreeps == undefined) {
      creepOrder("GeneralHand", room, null)
    }
    else if (generalCreeps != undefined || generalCreeps.length < (room.controller.level * 2)) {
      creepOrder("GeneralHand", room, null)
    }

    else if (builders != undefined && builders.length < (room.controller.level)) {
      creepOrder("Builder", room, null)
    }

    ContainerMiners()

    if (upgraders != undefined && upgraders.length < (room.controller.level)) {
      creepOrder("Builder", room, null)
    }



    if (patrolFlag == true) {
      if (patrollers == undefined || patrollers.length <= 3) {
        creepOrder("Patroller", room, null)
      }
    }
    //kodie flesh this out..
  }


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
      if (!room.memLog) {
        room.memLog
      }
      //what else can we put in here?

    }

  }



  static runType(room: Room, roomType: string) {
    if (roomType == "ColonyHub") {
      this.spawnerGo(room)
    }
  }
}


