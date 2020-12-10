import C from '/include/constants'
import each from 'lodash-es/each'
import BaseProcess from './BaseProcess'
import IFF from '/lib/IFF'
import filter from 'lodash-es/filter'
import {
  expand,
  findStorage,
  findIfSurplus
} from "/etc/common"

export default class Room extends BaseProcess {
  constructor(context) {
    super(context)
    this.context = context
    this.kernel = context.queryPosisInterface('baseKernel')
    this.segments = context.queryPosisInterface('segments')
  }
  get log() {
    return this.context.log
  }
  get memory() {
    return this.context.memory
  }
  get children() {
    this.memory.children = this.memory.children || {}
    return this.memory.children
  }
  get roomName() {
    return this.memory.room
  }
  get room() {
    return Game.rooms[this.roomName]
  }


  run() {
    
    if (!this.room || this.room.roomType == 'undefined') {
      this.log.warn(`Invalid Room, terminating. (${this.roomName},${JSON.stringify(this.memory)})`)
      this.kernel.killProcess(this.context.id)
    }
    let children
    if(this.room.roomType == 'home'){
     children = [
      ['JuicedProcesses/harvestManager', {
        room: this.roomName
      }],
      ['JuicedProcesses/upgradeManager', {
        room: this.roomName
      }],
      ['JuicedProcesses/roomDefense', {
        room: this.roomName
      }]
    ]
  } else if(this.room.roomType == 'reserved') {
    children = [
      ['JuicedProcesses/harvestManager', {
        room: this.roomName
      }],['JuicedProcesses/roomDefense', {
        room: this.roomName
      }]
    ]
  }
    each(children, ([child, context = {}]) => {
      this.ensureChild(child, child, context)
    })

    this.feederOrganiser()
    this.builderOrganiser()
  }

  /**
   * Spawns a feeder if needed
   */
  feederOrganiser() {
    let spawns = this.room.find(C.FIND_MY_STRUCTURES).filter(s => s.structureType === C.STRUCTURE_SPAWN)

    if (spawns.length) {
      var feeders = Math.max(1, this.room.extensions.length / 15) 
      for (let i = 0; i < feeders; i++) {
        const cid = this.ensureCreep(`feeder_${i}`, {
          rooms: [this.roomName],
          body: [
            expand([12, C.CARRY, 6, C.MOVE]),
            expand([4, C.CARRY, 4, C.MOVE]),
            expand([1, C.CARRY, 1, C.MOVE])
          ],
          priority: 1
        })

        this.ensureChild(`feeder_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['feeder', this.roomName]
        })
      }
    }
  }

  /**
   * Honestly just sick of seeing everyinthing in one damn run function
   * Spawns builder if there are construction sites
   */
  builderOrganiser() {
    if (this.room.find(C.FIND_MY_CONSTRUCTION_SITES).length) {
      //let surplus = findIfSurplus(this.room)
      let builders
      if(this.room.storage){
        if(this.room.storage.store.energy >= C.ENERGY_WANTED[this.room.controller.level]){
          builders = 1
        }else builders = 0
      }else {
        builders = 1
      }
     
      for (let i = 0; i < builders; i++) {
        const spawnTicket  = this.ensureCreep(`builder_${i}`, {
          rooms: [this.roomName],
          body: [
            expand([6, C.CARRY, 3, C.WORK, 3, C.MOVE]),
            expand([2, C.CARRY, 1, C.WORK, 1, C.MOVE])
          ],
          priority: 5
        })
        this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', {
          spawnTicket,
          base: ['builder', this.roomName]
        })
      }
    }

  }



  toString() {
    return `${this.roomName} ${this.room.level}/${this.room.controller.level}`
  }
}