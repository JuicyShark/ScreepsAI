import C from '/include/constants'
import BaseProcess from './BaseProcess'
import { expand, findIfSurplus } from "/etc/common"


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
            let min  = findIfSurplus(this.room) + 3
            const stored = this.room.storage && this.room.storage.store.energy || false 
             if (stored === false) {
              // 3-6 upgraders pre surplus
              want =  Math.max(1, this.room.extensions.length / 3.2)
            } else {
              //3-11 upgraders pre surplus
              if (stored.amount > C.ENERGY_WANTED) {
                want = Math.max(1, stored / C.ENERGY_WANTED)
              } else want = 1 
            }
            for(let i = 0; i < want; i++) {
              const cid = this.ensureCreep(`upgrader_${i}`, {
                rooms: [this.room.name],
                body: [
                  expand([10, C.CARRY, 6, C.WORK, 3, C.MOVE]),
                  expand([7, C.CARRY, 3, C.WORK, 3, C.MOVE ]),
                  expand([4, C.CARRY, 2, C.WORK, 2, C.MOVE]),
                  expand([2, C.CARRY, 1, C.WORK, 1, C.MOVE])
                ],
                priority: 7
              })
              this.ensureChild(`upgrader_${cid}`, 'JuicedProcesses/stackStateCreep', {
                spawnTicket: cid,
                base: ['upgrader', this.room.name]
              })   
            }
          }

      }

}
