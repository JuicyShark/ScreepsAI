import C from '/include/constants'
import BaseProcess from './BaseProcess'
import { expand } from "/etc/common"

export default class FlagManager extends BaseProcess {
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

  /**
   *  Runs the Flag Logic. Located in FlagManager.js
   */
  run() {
    this.sleep.sleep(50)
    //using for f
    for (let flag in Game.flags) {

      flag.room ? this.checkFlag(flag) :
 console.log("Getting Flag Manager ready")

    }
  }

  checkColor(flag){
    switch (flag.color){
      case 1:
        //Red
        break;
      case 2:
        //Purple
        break;
      case 3:
        //Blue
        break;
      case 4:
        //Cyan
        break;
      case 5:
        //Green
        break;
      case 6:
        //Yellow
        break;
      case 7:
        //Orange
        break;
      case 8:
        //Brown
        break;
      case 9:
        //Grey
        break;
      case 10:
        //White
        break;
            

    }
  }

  /**
   * Checks against the predefined logic cases.
   * @param flag - Takes the Flag object
   */
  checkFlag(flag) {
    let ab = flag.name
    let name = ab.toLowerCase()

    switch (name) {
      case "claim":
      this.claim(flag)
        break
        case "reserve":
          this.reserve(flag)
          break
      case "mining":
        this.checkVision(flag) ? this.ldm(flag) : this.keepVision(flag)
        break;
      case "attack":
        this.attack(flag)
        break;
      case "defend":
        this.defend(flag)
        break;
        //Default is to get and keep vision in the room if there isnt any name on the flag
      default:
       console.log(`no flag found under ${flag.name}`)
        break;
    }
    console.log(`found flag named: ${flag.name}`)
    //anymore logic to be done after

  }
  claim(flag){

  }
  reserve(flag){

  }
  /**
   * This will do some attack logic on an enemy room or if you just want a bunch of trigger happy attack creeps in a room... for "Defence"
   *  @param flag Flag Object
   */
  attack(flag){

        const cid = this.ensureCreep('protector_2', {
          rooms: [flag.pos.roomName],
          body: [
            expand([2, C.ATTACK, 2, C.MOVE]),
            expand([1, C.ATTACK, 1, C.MOVE])
          ],
          priority: 1
        })
        this.ensureChild(`protector_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', flag.pos.roomName]
        })
        flag.remove();
    


  }

  /**
   * This will prepair a load of creeps to be sent off as a defending party..
   *  @param flag Flag Object
   */
  defend(flag){

  }

  /**
   * This will hold the logic for making sure we keep vision in a room where a flag is
   * @param flag Flag Object
   */
  keepVision(flag){
    const cid = this.ensureCreep('claimer', {
      rooms: [flag.pos.roomName],
      body: [ MOVE, CLAIM ],
      priority: 10
    })
    this.ensureChild(`claimer_${cid}`, 'JuicedProcesses/stackStateCreep', {
      spawnTicket: cid,
      base: ['claimer', flag.pos.roomName]
    })

    //flag.room == undefined then we dont have vision. RoomObject unseeable..

  }

  checkVision(flag) {
    if(!flag.room){
      return false
    } else {return true}
  }


}