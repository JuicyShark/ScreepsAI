import C from '/include/constants'
//Child from Colony
export default class Intel {
  constructor(context) {
    this.context = context
    this.kernel = context.queryPosisInterface('baseKernel')
    this.sleep = context.queryPosisInterface('sleep')
    this.int = context.queryPosisInterface('interrupt')
    this.segments = context.queryPosisInterface('segments')
  }

  get log() {
    return this.context.log
  }

  run() {
    if (this.segments.load(C.SEGMENTS.INTEL) === false) {
      this.segments.activate(C.SEGMENTS.INTEL)
      this.int.clearAllInterrupts()
      this.int.wait(C.INT_TYPE.SEGMENT, C.INT_STAGE.START, C.SEGMENTS.INTEL)
    } else {
      this.int.setInterrupt(C.INT_TYPE.VISION, C.INT_STAGE.START)
      // this.sleep.sleep(10)
    }
    if (Game.flags.map) {
      this.log.warn('Map rendering is enabled')
      this.drawMap()
      this.drawMapImage()
    }
  }

  INTERRUPT({hook: {type,stage},key}) {
    this.log.info(`Collecting intel on ${key}`, )
    let room = Game.rooms[key]
    let mem = this.segments.load(C.SEGMENTS.INTEL) || {}
    let hr = mem.rooms = mem.rooms || {}
    let {
      name,
      controller: {
        id,
        level,
        pos,
        my,
        safeMode,
        owner: {
          username: owner
        } = {},
        reservation: {
          username: reserver,
          ticksToEnd
        } = {}
      } = {}
    } = room

    let structs = room.structures.all
    let byType = room.structures
    let [mineral] = room.find(C.FIND_MINERALS)
    let {
      mineralType
    } = mineral || {}
    let smap = ({id, pos}) => ({
      id, pos
    })
    let cmap = ({id, pos, body, hits, hitsMax }) => ({
      id, pos, body, hits, hitsMax
    })
    hr[room.name] = {
      hostile: level && !my,
      name,
      level,
      owner,
      reserver,
      spawns: room.spawns.map(smap),
      towers: room.towers.map(smap),
      walls: room.constructedWalls.length,
      ramparts: room.ramparts.length,
      creeps: room.find(C.FIND_HOSTILE_CREEPS).map(cmap),
      safemode: safeMode || 0,
      controller: id && {
        id,
        pos
      },
      sources: room.find(C.FIND_SOURCES).map(smap),
      mineral: mineralType,
      roomWorth: this.newBaseEvaluater(hr[room.name].sources, hr[room.name].owner, hr[room.name].mineral, hr[room.name].name),
      ts: Game.time
    }
    //    console.log(C.SEGMENTS.INTEL, mem.rooms.W6N1.owner)
    this.segments.save(C.SEGMENTS.INTEL, mem)
  }

  newBaseEvaluater(sources, owner, mineral, name) {
    const sourceP = 5
    let totalPoints

    if (owner == C.USERNAME) {
      totalPoints = 0
    } else {
      let pos = [C.USER.room.name, name]
      let distance = this.distanceCalcFromRoomName(pos)
      console.log(distance)
      totalPoints = sources.length * sourceP - distance
      console.log(totalPoints)
    }
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