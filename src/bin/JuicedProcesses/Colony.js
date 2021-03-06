import BaseProcess from './BaseProcess'
import C from '/include/constants'
import map from 'lodash-es/map'
import each from 'lodash-es/each'
import invoke from 'lodash-es/invoke'
import filter from 'lodash-es/filter'

export default class Colony extends BaseProcess {
  constructor(context) {
    super(context)
    this.context = context
    this.kernel = context.queryPosisInterface('baseKernel')
    this.segments = context.queryPosisInterface('segments')
  }

  get rooms() {
    this.memory.rooms = this.memory.rooms || {}
    return this.memory.rooms
  }

  run() {
    each(Game.rooms, (room, name) => {
      if (room.roomType == 'undefined') {
        delete this.rooms[name]
        return
      }
      if (!this.rooms[name]) {
        this.rooms[name] = {}
      }
    })
    each(this.rooms, (Room, room) => {
      let proc = this.kernel.getProcessById(Room.pid)
      if (!Game.rooms[room] || Game.rooms[room].roomType == 'undefined') {
        if (proc) {
          this.kernel.killProcess(Room.pid)
        }
        delete this.rooms[room]
      }
      if (!proc) {
        this.log.info(`Room not managed, beginning management of ${room}`)
        let {
          pid
        } = this.kernel.startProcess('JuicedProcesses/Room', {
          room
        })
        Room.pid = pid
      }
    })
    if (Game.flags.claim) {
        let {
          pos: {
            x,
            y,
            roomName
          }
        } = Game.flags.claim
        let room = Game.rooms[roomName]
        if (room && room.controller.my) {
          invoke(room.find(FIND_HOSTILE_STRUCTURES), 'destroy')
          invoke(room.find(FIND_HOSTILE_CONSTRUCTION_SITES), 'remove')
          Game.flags.claim.remove()
        } else {
          let cid = this.ensureCreep(`claimer_${roomName}`, {
            rooms: [roomName],
            body: [
              [MOVE, CLAIM]
            ],
            priority: 10
          })
          this.ensureChild(`claimer_${roomName}_${cid}`, 'JuicedProcesses/stackStateCreep', {
            spawnTicket: cid,
            base: ['claimer', {
              x,
              y,
              roomName
            }]
          })
        }
    }
    if (Game.flags.reserve) {
      let {
        pos: {
          x,
          y,
          roomName
        }
      } = Game.flags.reserve
      let room = Game.rooms[roomName]
      if (room && room.controller.reservation) {
        invoke(room.find(FIND_HOSTILE_STRUCTURES), 'destroy')
        invoke(room.find(FIND_HOSTILE_CONSTRUCTION_SITES), 'remove')
        Game.flags.reserve.remove()
      } else {
        let cid = this.ensureCreep(`reserver_${roomName}`, {
          rooms: [roomName],
          body: [
            [MOVE, MOVE, CLAIM, CLAIM]
          ],
          priority: 6
        })
        this.ensureChild(`reserver_${roomName}_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['reserver', {
            x,
            y,
            roomName
          }]
        })
      }
    }

  let want = Math.max(1, (this.rooms.length / 2))
  for (let i = 0; i < 1; i++) {
    let cid = this.ensureCreep(`scout_${i}`, {
      rooms: [C.USER.room.name],
      body: [
        [TOUGH, MOVE]
      ],
      priority: 10
    })
    this.ensureChild(`scout_${i}_${cid}`, 'JuicedProcesses/stackStateCreep', {
      spawnTicket: cid,
      base: ['scout']
    })
  }


  this.ensureChild('intel', 'JuicedProcesses/intel',)
//  this.ensureChild('flagManager', 'JuicedProcesses/flagManager',)
}

interrupt({
  hook: {
    type,
    stage
  },
  key
}) {
  this.log.info(`INT ${type} ${stage} ${key}`)
}

wake() {
  this.log.info('I Have awoken!')
}

toString() {
  let rooms = Object.keys(this.rooms)
  return `Rooms: ${rooms.length}`
}
}