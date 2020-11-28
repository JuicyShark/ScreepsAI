import C from '/include/constants'
import each from 'lodash-es/each'
import BaseProcess from './BaseProcess'
import IFF from '/lib/IFF'
import filter from 'lodash-es/filter'
import { expand } from "/etc/common"



export default class Room extends BaseProcess {
  constructor (context) {
    super(context)
    this.context = context
    this.kernel = context.queryPosisInterface('baseKernel')
    this.segments = context.queryPosisInterface('segments')
  }

  get log () {
    return this.context.log
  }

  get memory () {
    return this.context.memory
  }

  get children () {
    this.memory.children = this.memory.children || {}
    return this.memory.children
  }

  get roomName () {
    return this.memory.room
  }

  get room () {
    return Game.rooms[this.roomName]
  }
  

  run () {
    if (!this.room || !this.room.controller || !this.room.controller.my) {
      this.log.warn(`Invalid Room, terminating. (${this.roomName},${JSON.stringify(this.memory)})`)
      this.kernel.killProcess(this.context.id)
    }
    this.sleep.sleep(5)
    const children = [
      ['JuicedProcesses/harvestManager', { room: this.roomName }],
      ['JuicedProcesses/upgradeManager', { room: this.roomName }],
      ['JuicedProcesses/towerDefense', { room: this.roomName }],
      ['JuicedProcesses/layout', { room: this.roomName }] ]
    each(children, ([child, context = {}]) => {
      this.ensureChild(child, child, context)
    })
    let [container] = this.room.lookNear(C.LOOK_STRUCTURES, this.room.spawns[0].pos)
    .filter((s) => s.structureType === C.STRUCTURE_CONTAINER)
    let storage = this.room.find(C.FIND_STRUCTURES).filter(s => s.structureType === C.STRUCTURE_CONTAINER && s.hits < (s.hitsMax / 1.5))
    if(container || storage){
    var feeders = 1;
    for (let i = 0; i < feeders; i++) {
      const cid = this.ensureCreep(`feeder_${i}`, {
        rooms: [this.roomName],
        body: [
          expand([1, C.CARRY, 1, C.MOVE]),
          expand([4, C.CARRY, 4, C.MOVE])
        ],
        priority: 2
      })

      this.ensureChild(`feeder_${cid}`, 'JuicedProcesses/stackStateCreep', {
        spawnTicket: cid,
        base: ['feeder', this.roomName]
      })
    }
  }
    if (this.room.find(C.FIND_MY_CONSTRUCTION_SITES).length) {
      const cid = this.ensureCreep('builder_1', {
        rooms: [this.roomName],
        body: [
         expand([2, C.CARRY, 1, C.WORK, 1, C.MOVE])
        ],
        priority: 4
      })
       this.ensureChild(`builder_${cid}`, 'JuicedProcesses/stackStateCreep', {
         spawnTicket: cid,
          base: ['builder', this.roomName]
       })
    }
    const hostiles = this.room.find(C.FIND_HOSTILE_CREEPS).filter(IFF.notFriend)
    if (hostiles.length) {
      if (true || hostiles[0].owner.username === 'Invader') {
        const cid = this.ensureCreep('protector_1', {
          rooms: [this.roomName],
          body: [
            expand([2, C.ATTACK, 2, C.MOVE]),
            expand([1, C.ATTACK, 1, C.MOVE])
          ],
          priority: 0
        })
        this.ensureChild(`protector_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', this.roomName]
        })
      }
    }

    const attackFlags = filter(Game.flags, flag => flag.color === COLOR_RED)
    if(attackFlags.length){   
        const cid = this.ensureCreep('protector_2', {
          rooms: [this.roomName],
          body: [
            expand([2, C.ATTACK, 2, C.MOVE]),
            expand([1, C.ATTACK, 1, C.MOVE])
          ],
          priority: 0
        })
        this.ensureChild(`protector_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', attackFlags[0].pos.roomName]
        })
        attackFlags[0].remove();
    }

    this.cleanChildren()
  }
  toString () {
    return `${this.roomName} ${this.room.level}/${this.room.controller.level}`
  }
}
