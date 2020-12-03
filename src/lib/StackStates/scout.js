import IFF from '/lib/IFF'
import C from '../../include/constants'
const SIGN_MSG = `Territory of Juicy Boys`

//Scout needs to have 2 different functions. A "Auto Scout" and a "Intel/VISION"

export default {
  scout (state = {}) {
    const { room, pos, room: { controller } } = this.creep
    this.status = pos.toString()
    const user = controller && ((controller.owner && controller.owner.username) || (controller.reservation && controller.reservation.username))
    const friend = user && IFF.isFriend(user) || false
    const hostile = !friend && controller && controller.level > 0 && !controller.my
    const msg = SIGN_MSG

    //if no memory on creep create it
    if(!this.creep.memory.dirInfo){
      console.log(`creating new dirInfo Mem`)
      delete this.creep.memory.dirInfo
      this.creep.memory.dirInfo ={
        dir: 0
      }
    }

    // is room hostile?
    if (hostile) return this.log.warn(`${room.name} is hostile!`)

    // did we just come from a room? 
    let lastdir = 0 
    if (pos.y === 0) lastdir = C.TOP
    if (pos.y === 49) lastdir = C.BOTTOM
    if (pos.x === 0) lastdir = C.LEFT
    if (pos.x === 49) lastdir = C.RIGHT
  
    //find rooms around us
    let exits = Game.map.describeExits(this.creep.pos.roomName)

    //if there are no exits in direction we heading or going back way we came, find new direction
    let dir = this.creep.memory.dirInfo.dir
    if (!exits[dir] || (dir === lastdir && _.size(exits) > 1)) {
      this.creep.memory.dirInfo.dir = Math.ceil(Math.random() * 8)
    } 
  
    //create our target to go towards
      let exit = { x: 25, y: 25, roomName: exits[dir] }

      // have we signed this controller? 
      if (!hostile && !friend && controller && (!controller.sign || controller.sign.text !== msg)) {
        this.creep.say('Signing')
        this.push('signController', controller.id, msg)
        this.push('moveNear', controller.pos)
        return this.runStack()
      } 
      // guess we keep on scouting
      else if(this.creep.pos.roomName != exit.roomName && exit.roomName){
        this.push('moveToRoom', exit)
        return this.runStack()
      } else {
        this.creep.say(`Scout stuck`)
      }
    }
  
}
