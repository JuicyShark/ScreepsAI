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
    if (this.segments.load(C.SEGMENTS.INTEL) === false) {

    } else {
      let intelLog = this.segments.load(C.SEGMENTS.INTEL)
      let visionRooms = Game.rooms;
      let allFlags = Game.flags
      

      for (let room in visionRooms) {
        let roomMem = intelLog.rooms[`${room}`]
      }
    }
  }
  
}