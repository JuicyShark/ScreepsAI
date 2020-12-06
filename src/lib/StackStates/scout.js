import IFF from '/lib/IFF'
import C from '../../include/constants'
const SIGN_MSG = `Territory of Juicy Boys`


export default {
  scout (state = {}) {
    const { room, pos, room: { controller } } = this.creep
    this.status = pos.toString()
    const user = controller && ((controller.owner && controller.owner.username) || (controller.reservation && controller.reservation.username))
    const friend = user && IFF.isFriend(user) || false
    const hostile = !friend && controller && controller.level > 0 && !controller.my

    if (hostile) return this.log.warn(`${room.name} is hostile!`)

    let lastdir = 0
    if (pos.y === 0) lastdir = C.TOP
    if (pos.y === 49) lastdir = C.BOTTOM
    if (pos.x === 0) lastdir = C.LEFT
    if (pos.x === 49) lastdir = C.RIGHT

    let exits = Game.map.describeExits(room.name)
    let dir = 0
    while (!exits[dir] || (dir === lastdir && _.size(exits) > 1)) {
      dir = Math.ceil(Math.random() * 8)
    }

    let exit = pos.findClosestByRange(dir)
    let msg =  SIGN_MSG
    if (!hostile && !friend && controller && (!controller.sign || controller.sign.text !== msg)) {
      this.creep.say('Signing')
      this.push('signController', controller.id, msg)
      this.push('moveNear', controller.pos)
      return this.runStack()
    }
    let roomCallback = `r => r === '${room.name}' ? undefined : false`
    this.push('move', dir)
    this.push('moveNear', exit, { roomCallback })
    return this.runStack()
  }
}
