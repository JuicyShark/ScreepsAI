import * as creepMaster from '../ShowMaster/creepMaster';
import { getCacheExpiration, derefRoomPosition } from '../utils/helperFunctions';
import { Colony } from '../Colony'
import { configCreepTypes, creepBodySizes, creepPriority, roomTypes } from 'config'
import { ConversationStarter } from '../utils/personality/creepConversation'
import { SpawnTask, SpawnBrain } from "../prototypes/Spawn"

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
        miner: container ? container.hasMiner() : null

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


  static runTimer(room: Room): void {


    if (room.hostiles != undefined && room.hostiles.length >= 1) {
      //room.defend
    }


    if (!room.memory.timer || room.memory.timer == 0) {
      if (room.memory.log.length >= 30) {
        delete room.memory.log;
      }
      room.memory.timer = 60;
    }
    if (room.memory.timer % 8 === 0) {
      //checking for type of room
      for (let i in roomTypes) {
        if (room.roomType == roomTypes[i]) {
          this.runType(room)
        }
      }
    }
    if (room.memory.timer % 13 === 0) {
      room.checkandSpawn()
    }

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

  static runType(room: Room) {
    if (room.roomType == "ColonyHub") {
      SpawnBrain.spawnListChecker(room)
    }
    else if (room.roomType == "Outpost") {

    }
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
}


