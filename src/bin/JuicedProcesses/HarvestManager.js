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
    const spawnQueue = {}
    const census = {}
    const sources = this.room.find(C.FIND_SOURCES)
    const minerals = this.room.find(C.FIND_MINERALS)
    spawnQueue[this.room.name] = []
    census[this.room.name] = {}
    const creeps = this.room.find(FIND_MY_CREEPS)
    for (const creep of creeps) {
      census[creep.memory.group] = census[creep.memory.group] || 0
      census[creep.memory.group]++
    }
    spawns.push(...(this.room.spawns || C.USER))
    if(this.room.roomType == 'reserved'){
      let cid
      let {x,y,roomName} = this.room.controller.pos 
      if(this.room.controller.reservation.ticksToEnd >= 4000){
        cid  = this.ensureCreep(`reserver_${this.room.name}`, {
          rooms: [this.room.name],
          body: [
            [MOVE, CLAIM]
          ],
          priority: 6
        })
      }else{
         cid  = this.ensureCreep(`reserver_${this.room.name}`, {
          rooms: [this.room.name],
          body: [
            [MOVE, MOVE, CLAIM, CLAIM]
          ],
          priority: 6
        })
      }
      this.ensureChild(`reserver_${this.room.name}_${cid}`, 'JuicedProcesses/stackStateCreep', {
        spawnTicket: cid,
        base: ['reserver', {
          x,
          y,
          roomName
        }]
      })
    }
    each(sources, source => {

      const spawnTicket = this.ensureCreep(`${source.id}_harv`, {
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
          base: ['harvester', source.id]
        })

       let wanted            
         let dist = C.USER.room.storage && C.USER.room.storage.pos.findPathTo(source) || C.USER && C.USER.pos.findPathTo(source)
          let lastStep = dist.slice(-1)
          this.room.memory.pathTest = C.USER.room.storage.pos.findPathTo(source)
          this.room.memory.pathTest2 = lastStep
          if(lastStep[0].x == 0 || lastStep[0].x == 49) dist = dist.length * 2.2
          else if(lastStep[0].y == 0 || lastStep[0].y == 49) dist = dist.length * 2.2
          else dist = dist.length
         let maxParts = Math.min(Math.floor(((C.USER.room.energyCapacityAvailable / 50) * 0.80) / 2)) || 1
        let needed = Math.max(2, Math.ceil(((source.energyCapacity * 2) / (C.ENERGY_REGEN_TIME / (dist * 2))) / 50)) + 2
         wanted = Math.max(Math.ceil(needed / maxParts), 1);
       
      console.log(`dist: ${dist}, needed: ${needed}, maxParts: ${maxParts}, wanted: ${wanted}`)
        for (let i = 1; i <= wanted; i++) {
          const spawnTicket = this.ensureCreep(`${source.id}_coll_${i+1}`, {
            rooms: [this.room.name],
            // body: i ? cbody : wbody,
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
            base: ['collector', source.id, C.RESOURCE_ENERGY]
          })
        }
      })



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
    toString() {
      return this.memory.room
    }
  }

  function isObstacle(s) {
    return !!~C.OBSTACLE_OBJECT_TYPES.indexOf(s.structureType) && (s.structureType !== C.STRUCTURE_RAMPART || s.my)
  }