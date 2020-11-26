import C from '/include/constants'
import BaseProcess from './BaseProcess'


export default class UpgradeManager extends BaseProcess {
    constructor (context) {
      super(context)
      this.context = context
      this.controller = this.context.queryPosisInterface('controller')
      this.kernel = this.context.queryPosisInterface('baseKernel')
      this.sleeper = this.context.queryPosisInterface('sleep')
    }

    get room () {
        return Game.rooms[this.memory.room]
      }

      expand (body) {
        let count = 1
        let returnMe = []
        for (let a in body) {
          let t = body[a]
          if (typeof t === 'number') {
            count = t
          } else {
            for (let b = 0; b < count; b++) {
              returnMe.push(t)
            }
          }
        }
        return returnMe
      }

      run () {
        if (typeof this.memory.room === 'undefined') {
          throw new Error('Abort! Room not set')
        }
        if (!this.room) {
          this.log.warn(`No vision in ${this.memory.room}`)
          return
        }

        if (this.room.controller && this.room.controller.level && this.room.controller.level < 8) {
            let want
            const stored = this.room.storage && this.room.storage.store.energy || false
            if (stored === false) {
              want = 2 + Math.floor(this.room.extensions.length / 4)
            } else {
              if (stored > 10000) {
                want = Math.min(3, stored / 10000)
              }
            }
            for(let i = 0; i < want; i++) {
              const cid = this.ensureCreep(`upgrader_${i}`, {
                rooms: [this.roomName],
                body: [
                  this.expand([2, C.CARRY, 1, C.WORK, 1, C.MOVE]),
                  this.expand([4, C.CARRY, 2, C.WORK, 3, C.MOVE])
                ],
                priority: 7
              })
              this.ensureChild(`upgrader_${cid}`, 'JuicedProcesses/stackStateCreep', {
                spawnTicket: cid,
                base: ['upgrader', this.roomName]
              })   
            }
          }

      }

}
