import C from '/include/constants'
import BaseProcess from './BaseProcess'
import {expand} from '/etc/common'
import { each } from 'lodash-es'


export default class SeasonalBrain extends BaseProcess {
  constructor(context) {
    super(context)
    this.context = context
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
  get rooms() {
    return this.memory.rooms
  }

  run() {

    for(let room in this.rooms){
      console.log(Game.rooms[room], Game.rooms[room].controller.level)
      if (C.USER.room.controller.level >= 4) {
        this.collectPoints(Game.rooms[room])
      }
    }

    this.sleep.sleep(5)
  }
  takeToSink() {

  }
  collectPoints(room) {
    console.log(`looking for scoreContainers`)
    const scoreContainers = room.find(FIND_SCORE_CONTAINERS, {
      filter: (i) => i.store[RESOURCE_SCORE] > 500
    });
    console.log(`found ${scoreContainers}, total amount: ${scoreContainers.length}`)
    each(scoreContainers, scoreContainer => {
    //for(let score in scoreContainers){
      
      const spawnTicket = this.ensureCreep(`${scoreContainer.id}_coll_score`, {
        rooms: [room.name],
        // body: i ? cbody : wbody,
        body: [
          expand([6, C.CARRY, 6, C.MOVE]),
          expand([4, C.CARRY, 4, C.MOVE]),
          expand([2, C.CARRY, 2, C.MOVE]),
        ],
        priority: 3
      })
      this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', {
        spawnTicket,
        base: ['collector', scoreContainer.id, C.RESOURCE_SCORE]
      })
    })
  }
}