import C from '/include/constants'
import BaseProcess from './BaseProcess'

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

    //using for f
    for (flag in Game.flags) {

      this.checkFlag(flag)

    }
    /** if (Game.flags.claim) {
      let { pos: { x, y, roomName } } = Game.flags.claim
      let room = Game.rooms[roomName]
      if (room && room.controller.my) {
        invoke(room.find(FIND_HOSTILE_STRUCTURES), 'destroy')
        invoke(room.find(FIND_HOSTILE_CONSTRUCTION_SITES), 'remove')
        Game.flags.claim.remove()
      } else {
        let cid = this.ensureCreep(`claimer_${roomName}`, {
          rooms: [roomName],
          body: [[MOVE, CLAIM]],
          priority: 10
        })
        console.log(roomName, cid)
        this.ensureChild(`claimer_${roomName}_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['claimer', { x, y, roomName }]
        })
      }
    } */
  }

  /**
   * Checks against the predefined logic cases.
   * @param flag - Takes the Flag object
   */
  checkFlag(flag) {
    let ab = flag.name
    let name = ab.toLowerCase()

    switch (name) {
      case "mining":
        this.ldm(flag)
        break;
      case "attack":
        this.attack(flag)
        break;
      case "defend":
        this.defend(flag)
        break;
        //Default is to get and keep vision in the room if there isnt any name on the flag
      default:
        this.keepVision(flag)
        break;
    }

    //anymore logic to be done after

  }

  /**
   *  LDM LONG DISTANCE MINING
   *  This one is gonna be the bees knees
   *  @param flag Flag Object
   */
  ldm(flag) {

  }

  /**
   * This will do some attack logic on an enemy room or if you just want a bunch of trigger happy attack creeps in a room... for "Defence"
   *  @param flag Flag Object
   */
  attack(flag){

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

    //flag.room == undefined then we dont have vision. RoomObject unseeable..

  }


}