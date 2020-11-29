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
    if (this.segments.load(C.SEGMENTS.INTEL) === false) {} else {
      let intelLog = this.segments.load(C.SEGMENTS.INTEL)
      let visionRooms = Game.rooms;
      let allFlags = Game.flags

      let bestRoom = this.findBestRooms(intelLog)[0]
      for (let room in visionRooms) {
          if(!intelLog.rooms){
              break;
          }
        let roomMem = intelLog.rooms[`${room}`]
        if (room == bestRoom.roomName) {
          console.log(`placing flag at ${bestRoom.roomName}`)
          let flagPlacement = new RoomPosition(25, 25, `${bestRoom.roomName}`)
          flagPlacement.createFlag('claim')
        }
      }
      this.sleep.sleep(10000)
    }
  }

  //find best room out of all of intel segment currently
  // TODO have this program segment intel file as it can get v big and perform search over multiple ticks before 
  // placing flag
  findBestRooms(intelLog) {
    let bestRooms = []
    let bestRoom = 0
    for (let room in intelLog.rooms) {
        //roomWorth object key, intelLog.rooms[room] iswhat loop is 
      let roomWorth = intelLog.rooms[room].roomWorth
      if (roomWorth >= bestRoom) {
        bestRoom = roomWorth
        bestRooms = []
        bestRooms.push({
          roomName: room,
          totalPoints: roomWorth
        })
      } else continue
    }
    return bestRooms
  }
}