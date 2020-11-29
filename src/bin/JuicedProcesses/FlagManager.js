import C from '/include/constants'
import BaseProcess from './BaseProcess'

export default class FlagManager extends BaseProcess {
  constructor(context) {
    super(context)
    this.context = context
    this.kernel = context.queryPosisInterface('baseKernal')
    this.segments = context.queryPosisInterface('segments')
    this.sleep = context.queryPosisInterface('sleep')
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
     /** if (Game.flags.claim) {
      let { pos: { x, y, roomName } } = Game.flags.claim
      let room = Game.rooms[roomName]
      if (room && room.controller.my) {
        invoke(room.find(FIND_HOSTILE_STRUCTURES), 'destroy')
        invoke(room.find(FIND_HOSTILE_CONSTRUCTION_SITES), 'remove')
        Game.flags.claim.remove()
      } else {
        let cid = this.ensureCreep(`claimer_${roomName}`, {
          rooms: [roomName],
          body: [[MOVE, CLAIM]],
          priority: 10
        })
        console.log(roomName, cid)
        this.ensureChild(`claimer_${roomName}_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['claimer', { x, y, roomName }]
        })
      }
    } */
  }

  
}