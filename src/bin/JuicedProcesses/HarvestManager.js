import each from 'lodash-es/each'
import C from '/include/constants'
import BaseProcess from './BaseProcess'
import { expand } from "/etc/common"

export default class HarvestManager extends BaseProcess {
  constructor (context) {
    super(context)
    this.context = context
    this.spawner = this.context.queryPosisInterface('spawn')
    this.kernel = this.context.queryPosisInterface('baseKernel')
    this.sleeper = this.context.queryPosisInterface('sleep')
    this.roads = {}
  }

  get room () {
    return Game.rooms[this.memory.room]
  }

  run () {
    this.sleeper.sleep(5)
    if (typeof this.memory.room === 'undefined') {
      throw new Error('Abort! Room not set')
    }
    if (!this.room) {
      this.log.warn(`No vision in ${this.memory.room}`)
      return
    }
    const spawns = []
    const spawnQueue = {}
    const census = {}
    const sources = this.room.find(C.FIND_SOURCES)
    const minerals = this.room.find(C.FIND_MINERALS)
    spawnQueue[this.room.name] = []
    census[this.room.name] = {}
    const creeps = this.room.find(FIND_MY_CREEPS)
    for(const creep of creeps){
      census[creep.memory.group] = census[creep.memory.group] || 0
      census[creep.memory.group]++
    }
    spawns.push(...(this.room.spawns || []))
    each(sources, source => {
      const smem = this.room.memory.sources = this.room.memory.sources || {}
      const data = smem[source.id] = smem[source.id] || {}
      data.pos = { roomName: source.pos.roomName, x: source.pos.x, y: source.pos.y }
      data.id = source.id

      const hasRoad = this.roads[source.id] && this.roads[source.id].complete
      const maxParts = this.room.level > 2 && Math.min(hasRoad ? 33 : 25, Math.floor(((this.room.energyCapacity / 50) * 0.80) / 2)) || 1
      
      const spawnTicket = this.ensureCreep(`${source.id}_harv`, {
        rooms: [this.memory.room],
        body: [
          expand([5, C.WORK, 3, C.MOVE]),
          expand([4, C.WORK, 3, C.MOVE]),
          expand([3, C.WORK, 2, C.MOVE]),
          expand([2, C.WORK, 1, C.MOVE])
        ],
        priority: 2
      })
      this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['harvester', source.id] })

      //How many haulers per source
      const dist = (this.roads[source.id] && this.roads[source.id].path.length) || (this.storage && this.storage.pos.findPathTo(s).length) || 30
     const needed = Math.max(2, Math.ceil((source.energyCapacity / (C.ENERGY_REGEN_TIME / (dist * 2))) / 50)) + 2 
      var wanted = Math.min(Math.ceil(needed / maxParts), 2) / 2;
      for (let i = 1; i <= wanted; i++) {
        const spawnTicket = this.ensureCreep(`${source.id}_coll_${i+1}`, {
          rooms: [this.memory.room],
          // body: i ? cbody : wbody,
          body : [
            expand([6, C.CARRY, 6, C.MOVE]),
            expand([4, C.CARRY, 4, C.MOVE]),
            expand([2, C.CARRY, 2, C.MOVE]),
            expand([1, C.CARRY, 1, C.MOVE])
          ],
          priority: 3
        })
        this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['collector', source.id] })
      }
          })

    if (CONTROLLER_STRUCTURES[C.STRUCTURE_EXTRACTOR][this.room.level]) {      
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
    }
  }
  toString () {
    return this.memory.room
  }
}

function isObstacle(s){
  return !!~C.OBSTACLE_OBJECT_TYPES.indexOf(s.structureType) && (s.structureType !== C.STRUCTURE_RAMPART || s.my)
}
