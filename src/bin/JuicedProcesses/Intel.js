import C from '/include/constants'
import {
  each
} from 'lodash-es'
import BaseProcess from './BaseProcess'

//Child from Colony
export default class Intel extends BaseProcess {
  constructor(context) {
    super(context)
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
    let intelLog = this.segments.load(C.SEGMENTS.INTEL)
    if (intelLog === false) {
      this.segments.activate(C.SEGMENTS.INTEL)
      this.int.clearAllInterrupts()
      this.int.wait(C.INT_TYPE.SEGMENT, C.INT_STAGE.START, C.SEGMENTS.INTEL)
    } else {
      this.int.setInterrupt(C.INT_TYPE.VISION, C.INT_STAGE.START)
      this.sleep.sleep(5)
    }
    const children = [
      ['JuicedProcesses/colonyExpansion', {
        intelLog: intelLog.rooms
      }],
      ['JuicedProcesses/layout', {
        intelLog: intelLog.rooms
      }]
    ]
    each(children, ([child, context = {}]) => {
      this.ensureChild(child, child, context)
    })
  }

  INTERRUPT({
    hook: {
      type,
      stage
    },
    key
  }) {
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
    let smap = ({
      id,
      pos
    }) => ({
      id,
      pos
    })
    let cmap = ({
      id,
      pos,
      body,
      hits,
      hitsMax
    }) => ({
      id,
      pos,
      body,
      hits,
      hitsMax
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
      roomWorth: 0,
      //newBaseEvaluater(room.find(C.FIND_SOURCES).map(smap),  owner, name) || 0,
      ts: Game.time
    }
    this.segments.save(C.SEGMENTS.INTEL, mem)
  }
}