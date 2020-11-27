import C from '/include/constants'
import BaseProcess from './BaseProcess'
import { expand } from "/etc/common"


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
              want = 1 + Math.floor(this.room.extensions.length / 2.5)
            } else {
              if (stored > 10000) {
                want = Math.max(3, stored / 100000)
              }
            }
            for(let i = 0; i < want; i++) {
              const cid = this.ensureCreep(`upgrader_${i}`, {
                rooms: [this.roomName],
                body: [
                  expand([7, C.CARRY, 3, C.WORK, 3, C.MOVE ]),
                  expand([4, C.CARRY, 2, C.WORK, 2, C.MOVE]),
                  expand([2, C.CARRY, 1, C.WORK, 1, C.MOVE])
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
