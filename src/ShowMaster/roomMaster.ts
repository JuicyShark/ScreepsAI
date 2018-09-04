import * as creepMaster from '../ShowMaster/creepMaster';
import { getCacheExpiration, derefRoomPosition } from '../utils/helperFunctions';
import { Colony } from '../Colony'
import { ConversationStarter } from '../utils/personality/creepConversation'


//Exports Below
/*export function delegateTimeSlots(room: Room): void {
    if(room.playerHostiles != undefined) {

    }
    //getRoomNeedsInPriority
}*/
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

export function shotCaller(): void {
    for (var i in Game.colonies) {
        var colony = Game.colonies[i]
        delegateToSpawns(colony)
        creepMaster.setCreepTasks(colony)
        //ConversationStarter(colony.rooms[0]);
    }
}

export function delegateToSpawns(colony: Colony): void {
    // Separate creeps by role
    let harvesters: Creep[] | undefined = colony.creepsByRole.Harvester;
    let upgraders: Creep[] | undefined = colony.creepsByRole.Upgrader;
    let builders: Creep[] | undefined = colony.creepsByRole.Builder;
    let lorrys: Creep[] | undefined = colony.creepsByRole.Lorry;
    //let patrollers: Creep[] | undefined = colony.creepsByRole.Patroller;
    let spawn: StructureSpawn | null = colony.room.spawns[0];
    // Spawn creeps as needed
    if (spawn != null) {
        let type: string;
        let spawnTask;
        if (harvesters == undefined || harvesters.length < 1) {
            type = 'Harvester';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask)
        } else if (upgraders == undefined || upgraders.length < 3) {
            type = 'Upgrader';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask)
        } else if (builders == undefined || builders.length < 1) {
            type = 'Builder';
            spawnTask = {
                type: type,
                body: [WORK, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask);
        } else if (lorrys == undefined || lorrys.length < 1) {
            type = 'Lorry';
            spawnTask = {
                type: type,
                body: [CARRY, CARRY, MOVE],
                room: spawn.room.name
            }
            queToSpawn(spawn, spawnTask);
        } else { console.log("All Spawned") }
    }

}

export function queToSpawn(spawn: StructureSpawn, spawnTask: spawnTask): any {

    return spawn.spawnNewCreep(spawnTask.body, spawnTask.type, spawnTask.room)

}

const RECACHE_TIME = 2500;
const OWNED_RECACHE_TIME = 1000;

export class RoomBrain {

    /* Records all info for permanent room objects, e.g. sources, controllers, etc. */
    private static recordPermanentObjects(room: Room): void {
        let savedSources: SavedSource[] = [];
        console.log(`${room.sources}`)
        for (let source of room.sources) {
            let container = source.pos.findClosestByLimitedRange(room.containers, 2);
            console.log(`${container}`)
            savedSources.push({
                c: source.pos.coordName,
                contnr: container ? container.pos.coordName : undefined
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

