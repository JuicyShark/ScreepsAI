import C from '/include/constants'
//Child from Colony
export default class Intel {
  constructor (context) {
    this.context = context
    this.kernel = context.queryPosisInterface('baseKernel')
    this.sleep = context.queryPosisInterface('sleep')
    this.int = context.queryPosisInterface('interrupt')
    this.segments = context.queryPosisInterface('segments')
  }

  get log () {
    return this.context.log
  }

  run () {
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

  INTERRUPT ({ hook: { type, stage }, key }) {
    this.log.info(`Collecting intel on ${key}`,)
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
        owner: { username: owner } = {},
        reservation: { username: reserver, ticksToEnd } = {}
      } = {}
    } = room

    let structs = room.structures.all
    let byType = room.structures
    let [ mineral ] = room.find(C.FIND_MINERALS)
    let { mineralType } = mineral || {}
    let smap = ({ id, pos }) => ({ id, pos })
    let cmap = ({ id, pos, body, hits, hitsMax }) => ({ id, pos, body, hits, hitsMax })
    hr[room.name] = {
      hostile: level && !my,
      name,
      //controller level
      level,

      owner,
      // reserver not shown in neutral or home room at all in Seg6
      reserver,
      // list of spawns and containing object info(id, pos, roomName)
      spawns: room.spawns.map(smap),
      //surely same as above but for towers
      towers: room.towers.map(smap),
      walls: room.constructedWalls.length,
      ramparts: room.ramparts.length,
      creeps: room.find(C.FIND_HOSTILE_CREEPS).map(cmap),
      safemode: safeMode || 0,
      controller: id && { id, pos },
      sources: room.find(C.FIND_SOURCES).map(smap),
      mineral: mineralType,
      roomWorth: this.newBaseEvaluater(hr[room.name].sources, hr[room.name].owner, hr[room.name].mineral, hr[room.name].name),
      //oddly the same tick shown in examples of two diff rooms
      ts: Game.time
    }
//    console.log(C.SEGMENTS.INTEL, mem.rooms.W6N1.owner)
    this.segments.save(C.SEGMENTS.INTEL, mem)
  }
/** 
   * @param { 'Object pulled from Intel Memory'} roomMem 
   * @param { 'Bases we operate out of'} home 
   * @return {'total point worth to a list'}
   */
  newBaseEvaluater(sources, owner, mineral, name) {
    //point values
    const sourceP = 5
    let totalPoints

    
      if (owner == C.USERNAME) {
        console.log('this is home ahhh sweet sweet home') 
        totalPoints = 0
        }
        else {
          let pos = [C.USER.room.name, name]
         let distance = this.distanceCalcFromRoomName(pos)
        
        totalPoints = sources.length * sourceP * distance
        console.log('logging pointWorth')
        console.log('total points: ', totalPoints)
        }
    return totalPoints
  }
  distanceCalcFromRoomName(wholeString){
    let pos = []
    const nextDoor = 10
    const TDD = 4
    const Far = 0
    let distance
    console.log(wholeString)
    for(let string in wholeString){
    let repString = wholeString[string].replace(/W|S|E|N/gi, ' ')
    repString = repString.slice(1)
    pos.push(repString.split(' '))
    }
    console.log(pos, pos.length)
    // have an array of room x-y inside an array, storing all numbers as one
    //want to mins x of room1 and room2 and find out
   let newpos = []
    for(let number in pos){
      let posnumber = pos[number]
      console.log(posnumber)
      for(let n in posnumber){
        let please = Math.floor(posnumber[n])
        newpos.push(please)
      }
    }
    console.log(newpos, newpos.length)
   let pos1 = newpos[0] - newpos[2]
   let pos2 = newpos[1] - newpos[3]

   if (pos1+pos2 == 1 || -1) distance = nextDoor
   else if (pos1+pos2 == 2 || -2 )distance = TTD
  else distance = Far
  
  return  distance
}

  }
