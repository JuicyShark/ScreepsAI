import each from 'lodash-es/each'
import C from '/include/constants'
import BaseProcess from './BaseProcess'

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

  expand (body) {
    let count = 1
    let returnMe = []
    for (let a in body) {
      let t = body[a]
      if (typeof t === 'number') {
        count = t
      } else {
        for (let b = 0; b < count; b++) {
          returnMe.push(t)
        }
      }
    }
    return returnMe
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
      if (this.room.controller.level > 3) {
      const maxParts = Math.min(25, Math.floor(((this.room.energyCapacityAvailable / 50) * 0.8) / 2))
      const needed = Math.max(2, Math.ceil((source.energyCapacity / (C.ENERGY_REGEN_TIME / (data.dist * 2))) / 50)) + 2
      const wantedCarry = Math.ceil(needed / maxParts)
      const wantedWork = Math.min(5, Math.floor((this.room.energyCapacityAvailable - 100) / 100))
      const cbody = this.expand([maxParts, C.CARRY, maxParts, C.MOVE])
      const wbody = this.expand([1, C.CARRY, 1, C.MOVE, wantedWork, C.WORK])
      const cgroup = `${source.id}c`
      const wgroup = `${source.id}w`
      const neededCreepsCarry = Math.max(0, wantedCarry - (census[cgroup] || 0))
      const neededCreepsWork = Math.max(0, Math.ceil(5 / wantedWork) - (census[wgroup] || 0))
      this.log.info(`${source.id} ${neededCreepsWork} ${neededCreepsCarry}`)
      if (neededCreepsWork) {
        spawnQueue[this.room.name].push({
          name: wgroup + Game.time,
          body: wbody,
          cost: wbody.reduce((t, p) => t + C.BODYPART_COST[p], 0),
          memory: {
            group: wgroup,
            home: this.room.name,
            stack: [['miningWorker', data.pos]]
          }
        })
      }
      if (neededCreepsCarry) {
        spawnQueue[this.room.name].push({
          name: cgroup + Game.time,
          body: cbody,
          cost: cbody.reduce((t, p) => t + C.BODYPART_COST[p], 0),
          memory: {
            group: cgroup,
            home: this.room.name,
            stack: [['miningCollector', data.pos, wgroup]]
          }
        })
      }
      for (const spawn of spawns) {
        if (spawn.spawning) continue
        const room = spawn.room
        const [{ name, body, cost, memory } = {}] = spawnQueue[room.name].splice(0, 1)
        if (!name) continue
        if (spawn.room.energyAvailable < cost) continue
        const spawnTicket = this.ensureCreep(`${source.id}_`)
        log.info(`${spawn.room.name} Spawning ${name} ${memory.group}`)
        spawn.spawnCreep(body, name, { memory })
      }
    } else {
      const hasRoad = this.roads[source.id] && this.roads[source.id].complete
      const maxParts = this.room.level > 2 && Math.min(hasRoad ? 33 : 25, Math.floor(((this.room.energyCapacity / 50) * 0.80) / 2)) || 1
      
      const spawnTicket = this.ensureCreep(`${source.id}_harv`, {
        rooms: [this.memory.room],
        body: [
          this.expand([5, C.WORK, 3, C.MOVE]),
          this.expand([4, C.WORK, 3, C.MOVE]),
          this.expand([3, C.WORK, 2, C.MOVE]),
          this.expand([2, C.WORK, 1, C.MOVE])
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
            this.expand([6, C.CARRY, 6, C.MOVE]),
            this.expand([4, C.CARRY, 4, C.MOVE]),
            this.expand([2, C.CARRY, 2, C.MOVE]),
            this.expand([1, C.CARRY, 1, C.MOVE])
          ],
          priority: 3
        })
        this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['collector', source.id] })
      }
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
              this.expand([49, C.WORK, 1, C.MOVE]),
              this.expand([40, C.WORK, 1, C.MOVE]),
              this.expand([30, C.WORK, 1, C.MOVE]),
              this.expand([25, C.WORK, 1, C.MOVE]),
              this.expand([20, C.WORK, 1, C.MOVE]),
              this.expand([15, C.WORK, 1, C.MOVE]),
              this.expand([10, C.WORK, 1, C.MOVE]),
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
              this.expand([8, C.CARRY, 8, C.MOVE]),
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
