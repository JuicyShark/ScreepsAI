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
    
    if (!this.room && this.room.roomType == 'undefined') {
      this.log.warn(`Invalid Room, terminating. (${this.roomName},${JSON.stringify(this.memory)})`)
      this.kernel.killProcess(this.context.id)
    }

    //this.sleep.sleep(5)
    let children
    if(!this.room.controller.reservation){
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
  } else {
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

    this.cleanChildren()


  }

  /**
   * Spawns a feeder if needed
   */
  feederOrganiser() {
    let [container] = this.room.lookNear(C.LOOK_STRUCTURES, this.room.find(C.FIND_STRUCTURES).filter((s) => s.structureType === C.STRUCTURE_CONTAINER))
    let storage = this.room.find(C.FIND_STRUCTURES).filter(s => s.structureType === C.STRUCTURE_STORAGE && s.hits < (s.hitsMax / 1.5))
    let spawns = this.room.find(C.FIND_MY_STRUCTURES).filter(s => s.structureType === C.STRUCTURE_SPAWN)

    if ((container || storage) && spawns[0]) {
      var feeders = 1;
      for (let i = 0; i < feeders; i++) {
        const cid = this.ensureCreep(`feeder_${i}`, {
          rooms: [this.roomName],
          body: [
            expand([1, C.CARRY, 1, C.MOVE]),
            expand([4, C.CARRY, 4, C.MOVE])
          ],
          priority: 4
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
      let surplus = findIfSurplus(this.room)
      let builders = 1 + surplus
      for (let i = 0; i < builders; i++) {
        const cid = this.ensureCreep(`builder_${i}`, {
          rooms: [this.roomName],
          body: [
            expand([2, C.CARRY, 1, C.WORK, 1, C.MOVE]),
            expand([6, C.CARRY, 3, C.WORK, 3, C.MOVE])
          ],
          priority: 5
        })
        this.ensureChild(`builder_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['builder', this.roomName]
        })
      }
    }

  }



  toString() {
    return `${this.roomName} ${this.room.level}/${this.room.controller.level}`
  }
}