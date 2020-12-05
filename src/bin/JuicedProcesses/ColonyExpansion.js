import C from '/include/constants'
import BaseProcess from './BaseProcess'


export default class ColonyExpansion extends BaseProcess {
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
      this.log.info(`Unable to find intel segment sleeping for 50 Ticks`)
      this.sleep.sleep(50)
    } else {
      let intelLog = this.segments.load(C.SEGMENTS.INTEL)
      let visionRooms = Game.rooms;
      let allFlags = Game.flags

     
      for (let room in visionRooms) {
        if (!intelLog.rooms) {
          this.log.info(`cannot find anything useful in Intel, Sleeping for 50 Ticks`)
          this.sleep.sleep(50)
        } else {
          if(!Memory.rooms) break
          if(Game.GCL >= Memory.rooms.length){
          let bestRoom = this.findBestRooms(intelLog)[0]
          let roomMem = intelLog.rooms[`${room}`]
          if (room == bestRoom.roomName) {
            console.log(`placing flag at ${bestRoom.roomName}`)
            let flagPlacement = new RoomPosition(25, 25, `${bestRoom.roomName}`)
            flagPlacement.createFlag('claim')
          }}
        }
      }
      this.sleep.sleep(10)
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
  newBaseEvaluater(sources, owner, mineral, name) {
    const sourceP = 5
    let totalPoints
    console.log(`base eval info coming up: like is our controller level 2 or more? ${C.USER.room.controller.level}`)
    if (owner == C.USERNAME || C.USER.room.controller.level >= 2) {
      totalPoints = 0
    } else {
      let pos = [C.USER.room.name, name]
      let distance = this.distanceCalcFromRoomName(pos)
      console.log(`room distance from home ${distance}`)
      totalPoints = sources.length * sourceP - distance
    }
    console.log(`our total point value: ${totalPoints}`)
    return totalPoints
  }

  // sets a distance value based on W6N1 - W7N1 = (6-7) + (1-1) * 5
  distanceCalcFromRoomName(wholeString) {
    let pos = []
    let distance
    for (let string in wholeString) {
      let repString = wholeString[string].replace(/W|S|E|N/gi, ' ')
      repString = repString.slice(1)
      pos.push(repString.split(' '))
    }
    let newpos = []
    for (let number in pos) {
      let posnumber = pos[number]
      for (let n in posnumber) {
        let please = Math.floor(posnumber[n])
        newpos.push(please)
      }
    }
    let pos1 = newpos[0] - newpos[2]
    let pos2 = newpos[1] - newpos[3]
    distance = Math.abs(pos1) + Math.abs(pos2)
    return distance
  }
}