
// Room brain - provides information related to room structure and occupation
import {getCacheExpiration} from '../utils/helperFunctions';
const RECACHE_TIME = 2500;
const OWNED_RECACHE_TIME = 1000;
const RoomIntelMemoryDefaults = {};

export class RoomBrain {

    private static recordPermanentObjects(room: Room): void {
        let savedSources: SavedSource[] = [];
        for( let source of room.sources){
            let container = source.pos.findClosestByLimitedRange(room.containers, 2);
            savedSources.push({
                c : source.pos.coordName,
                contnr: container ? container.pos.coordName : undefined
            });
        }
        room.memory.src = savedSources;
        room.memory.ctrl = room.controller ? {
            c      : room.controller.pos.coordName,
			level  : room.controller.level,
			owner  : room.controller.owner ? room.controller.owner.username : undefined,
			res    : room.controller.reservation,
			SM     : room.controller.safeMode,
			SMavail: room.controller.safeModeAvailable,
			SMcd   : room.controller.safeModeCooldown,
			prog   : room.controller.progress,
			progTot: room.controller.progressTotal
        } : undefined;
        room.memory.mnrl = room.mineral ? {
            c          : room.mineral.pos.coordName,
			density    : room.mineral.density,
			mineralType: room.mineral.mineralType
        } : undefined;
        room.memory.SKlairs = _.map(room.keeperLairs, lair => {
			return {c: lair.pos.coordName};
		});
		if (room.controller && room.controller.owner) {
			room.memory.importantStructs = {
				towers  : _.map(room.towers, t => t.pos.coordName),
				spawns  : _.map(room.spawns, s => s.pos.coordName),
				storage : room.storage ? room.storage.pos.coordName : undefined,
				terminal: room.terminal ? room.terminal.pos.coordName : undefined,
				walls   : _.map(room.walls, w => w.pos.coordName),
				ramparts: _.map(room.ramparts, r => r.pos.coordName),
			};
		} else {
			room.memory.importantStructs = undefined;
		}
		room.memory.tick = Game.time;
    }
    
	static roomOwnedBy(roomName: string): string | undefined {
		if (Memory.rooms[roomName] && Memory.rooms[roomName].ctrl && Memory.rooms[roomName].ctrl!.owner) {
			if (Game.time - (Memory.rooms[roomName].tick || 0) < 25000) { // ownership expires after 25k ticks
				return Memory.rooms[roomName].ctrl!.owner;
			}
		}
	}

	static roomReservedBy(roomName: string): string | undefined {
		if (Memory.rooms[roomName] && Memory.rooms[roomName].ctrl && Memory.rooms[roomName].ctrl!.res) {
			if (Game.time - (Memory.rooms[roomName].tick || 0) < 10000) { // reservation expires after 10k ticks
				return Memory.rooms[roomName].ctrl!.res!.username;
			}
		}
    }

    static run(): void {
		
		for (let name in Game.rooms) {
			const room = Game.rooms[name];
			// Record location of permanent objects in room and recompute score as needed
			if (!room.memory.expiration || Game.time > room.memory.expiration) {
				this.recordPermanentObjects(room);
				// Refresh cache
				let recacheTime = room.owner ? OWNED_RECACHE_TIME : RECACHE_TIME;
				room.memory.expiration = getCacheExpiration(recacheTime, 250);
			}

		}
	}

}