import C from '/include/constants'
import BaseProcess from './BaseProcess'


export default class SeasonalBrain extends BaseProcess {
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
    let visionRooms = Game.rooms;
    for (let room in visionRooms) {
      let curRoom = visionRooms[room]
      if (curRoom.controller.level >= 4) {
        const scoreContainers = curRoom.find(FIND_SCORE_CONTAINERS, {
          filter: (i) => i.store[RESOURCE_SCORE] > 500
        });
        if (scoreContainers) {
          console.log(`Found Score Containers!`)
        }
      }else continue 
    }
    this.sleep.sleep(5)
  }
  takeToSink() {

  }
  collectPoints() {

  }
}