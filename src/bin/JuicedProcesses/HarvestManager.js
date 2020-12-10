import each from 'lodash-es/each'
import C from '/include/constants'
import BaseProcess from './BaseProcess'
import {
  expand,
  findIfSurplus
} from "/etc/common"

export default class HarvestManager extends BaseProcess {
  constructor(context) {
    super(context)
    this.context = context
    this.spawner = this.context.queryPosisInterface('spawn')
    this.kernel = this.context.queryPosisInterface('baseKernel')
    this.sleeper = this.context.queryPosisInterface('sleep')
    this.roads = {}
  }

  get room() {
    return Game.rooms[this.memory.room]
  }

  run() {
    this.sleeper.sleep(5)
    if (typeof this.memory.room === 'undefined') {
      throw new Error('Abort! Room not set')
    }
    if (!this.room) {
      this.log.warn(`No vision in ${this.memory.room}`)
      return
    }
    const spawns = []
    const minerals = this.room.find(C.FIND_MINERALS)
    spawns.push(...(this.room.spawns || C.USER))
    if (this.room.roomType == 'reserved') {
      let cid
      let {
        x,
        y,
        roomName
      } = this.room.controller.pos
      let body
      if (this.room.controller.reservation.ticksToEnd >= 4000) {
        body = [
          [MOVE, CLAIM]
        ]
      } else {
        body = [
          [MOVE, MOVE, CLAIM, CLAIM]
        ]
      }
      cid = this.ensureCreep(`reserver_${this.room.name}`, {
        rooms: [this.room.name],
        body: body,
        priority: 6
      })
      this.ensureChild(`reserver_${this.room.name}_${cid}`, 'JuicedProcesses/stackStateCreep', {
        spawnTicket: cid,
        base: ['reserver', {
          x,
          y,
          roomName
        }]
      })
    }
    if (this.room.roomType == 'home' && !this.room.structures[STRUCTURE_SPAWN]) {
      for (let i = 0; i < 3; i++) {
        const spawnTicket = this.ensureCreep(`Remotebuilder_${i}`, {
          rooms: [this.room.name],
          body: [
            expand([10, C.CARRY, 2, C.WORK, 6, C.MOVE])
          ],
          priority: 8
        })
        this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', {
          spawnTicket,
          base: ['builder', this.room.name]
        })
      }
    } else {
      let sources
      if(!this.room.memory.sources){
       sources = this.getSources(this.room)}
      else sources = this.room.memory.sources
      for (let source in sources) {
        let sourceObj = Game.getObjectById(sources[source].id)
        let dist
        if (this.room.memory.sources[source].dist) {
          dist = this.room.memory.sources[source].dist
        } else {
          dist = this.findDist(sourceObj)
          this.room.memory.sources[source].dist = dist
          dist = this.room.memory.sources[source].dist
        }
        const spawnTicket = this.ensureCreep(`${sources[source].id}_harv`, {
          rooms: [this.room.name],
          body: [
            expand([5, C.WORK, 2, C.MOVE]),
            expand([4, C.WORK, 2, C.MOVE]),
            expand([3, C.WORK, 1, C.MOVE]),
            expand([2, C.WORK, 1, C.MOVE])
          ],
          priority: 2
        })
        this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', {
          spawnTicket,
          base: ['harvester', sourceObj.id]
        })

        let maxParts = Math.min(Math.floor(((C.USER.room.energyCapacityAvailable / 50) * 0.80) / 2)) || 1
        let needed = Math.max(2, Math.ceil(((sourceObj.energyCapacity * 2) / (C.ENERGY_REGEN_TIME / (dist * 2))) / 50)) + 2
        let wanted = Math.max(Math.ceil(needed / maxParts), 1);

        // console.log(`dist: ${dist}, needed: ${needed}, maxParts: ${maxParts}, wanted: ${wanted}`)
        for (let i = 1; i <= wanted; i++) {
          const spawnTicket = this.ensureCreep(`${source.id}_coll_${i+1}`, {
            rooms: [this.room.name],
            body: [
              expand([10, C.CARRY, 5, C.MOVE]),
              expand([6, C.CARRY, 3, C.MOVE]),
              expand([4, C.CARRY, 2, C.MOVE]),
              expand([2, C.CARRY, 1, C.MOVE]),
            ],
            priority: 3
          })
          this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', {
            spawnTicket,
            base: ['collector', sourceObj.id, C.RESOURCE_ENERGY]
          })
        }
      }
    }


    /**    if (CONTROLLER_STRUCTURES[C.STRUCTURE_EXTRACTOR][this.room.level]) {      
          each(minerals, mineral => {
            let [extractor] = mineral.pos.lookFor(C.LOOK_STRUCTURES)
            if (!extractor) {
              let [csite] = mineral.pos.lookFor(C.LOOK_CONSTRUCTION_SITES)
              if (!csite) {
                csite = mineral.pos.createConstructionSite(C.STRUCTURE_EXTRACTOR)
              }
              return
            }
            {
              let spawnTicket = this.ensureCreep(`${mineral.id}_harv`, {
                rooms: [this.memory.room],
                body: [
                  expand([49, C.WORK, 1, C.MOVE]),
                  expand([40, C.WORK, 1, C.MOVE]),
                  expand([30, C.WORK, 1, C.MOVE]),
                  expand([25, C.WORK, 1, C.MOVE]),
                  expand([20, C.WORK, 1, C.MOVE]),
                  expand([15, C.WORK, 1, C.MOVE]),
                  expand([10, C.WORK, 1, C.MOVE]),
                ],
                priority: 8,
                maxRange: 1
              })
              this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['harvester', mineral.id] })
            }
            {
              let spawnTicket = this.ensureCreep(`${mineral.id}_coll_1`, {
                rooms: [this.memory.room],
                body: [
                  expand([8, C.CARRY, 8, C.MOVE]),
                ],
                priority: 8,
                maxRange: 1
              })
              this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['collector', mineral.id, mineral.mineralType] })
            }
          })
        }*/
  }
  //very expensive calc to find amount of tiles between point A-B even across rooms
  findDist(source) {
    console.log(`expensive call FindDist happening`)
    let dist = C.USER.room.storage && C.USER.room.storage.pos.findPathTo(source) ||  C.USER.pos.findPathTo(source)
    let lastStep = dist.slice(-1)
    dist = dist.length
    if (lastStep[0].x == 0 || lastStep[0].x == 49 || lastStep[0].y == 0 || lastStep[0].y == 49) {
      let roomDist = Game.map.getRoomLinearDistance(C.USER.room.name, source.pos.roomName)
      if (roomDist > 1) {
        for (let i = 0; i < roomDist; i++) {
          dist = dist + 50
        }
      } else {
        let exit
        if (lastStep[0].x == 0)exit = C.FIND_EXIT_LEFT
        else if (lastStep[0].x == 49)exit = C.FIND_EXIT_RIGHT
        else if (lastStep[0].y == 0)exit = C.FIND_EXIT_TOP
        else if(lastStep[0].y == 49)exit = C.FIND_EXIT_BOTTOM
        let lastRoomName = C.USER.room.find(exit)[0].roomName
        let entry
        switch (exit) {
          case C.FIND_EXIT_LEFT:
             entry = new RoomPosition(49, lastStep[0].y, `${lastRoomName}`)
            break;
          case C.FIND_EXIT_RIGHT:
             entry = new RoomPosition(0, lastStep[0].y, `${lastRoomName}`)
            break;
          case C.FIND_EXIT_TOP:
             entry = new RoomPosition(lastStep[0].x, 49, `${lastRoomName}`)
            break;
          case C.FIND_EXIT_BOTTOM:
             entry = new RoomPosition(lastStep[0].x, 0, `${lastRoomName}`)
            break;
        }
        dist = dist + entry.findPathTo(source).length
      }
    }
    return dist
  }

  getSources(room) {
    let sources
      let allSources = []
      sources = room.find(C.FIND_SOURCES)
      for (let source in sources) {
        let {
          pos,
          id
        } = sources[source]
        let sourceMem = {
          pos: pos,
          id: id
        }
        allSources.unshift(sourceMem)
      }
      room.memory.sources = allSources
    return sources
  }

  toString() {
    return this.memory.room
  }
}

function isObstacle(s) {
  return !!~C.OBSTACLE_OBJECT_TYPES.indexOf(s.structureType) && (s.structureType !== C.STRUCTURE_RAMPART || s.my)
}