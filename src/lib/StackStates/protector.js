import C from '/include/constants'
import IFF from '/lib/IFF'

export default {
  protector (target, cache = {}) {

    
    target = { x, y, roomName: target }
    const tgt = this.resolveTarget(target)
    this.creep.say("Moving Rooms")
    if (this.creep.pos.roomName !== tgt.roomName) {
      this.push('moveToRoom', tgt)
      this.runStack()
    }

    const { room, pos } = this.creep
    const walls = room.find(C.FIND_STRUCTURES, {filter: (s) =>s.structureType === STRUCTURE_WALL})
    const hostiles = room.find(C.FIND_HOSTILE_CREEPS) || room.find(C.FIND_HOSTILE_STRUCTURES || walls.length);
    const hostile = pos.findClosestByRange(hostiles || walls)
    this.creep.say("HELLO")
    console.log("help me here ", this.creep.name)
      if(hostiles && hostiles.length != 0){
        this.creep.say("I see them")
        let close = pos.findInRange(FIND_HOSTILE_CREEPS, 3) || false;
        let tarid = hostiles.shift();
        this.creep.memory.target = tarid;
        let targetID = this.creep.memory.target;
        
        //If they like 3 tiles away
        if(close != false && this.creep.getActiveBodyparts(RANGED_ATTACK) > 0){
          let closepos = close[0].pos
          if((close.length >= 1)){
            targetID = close[0].id
            this.push('rangedMassAttack')
            this.push('flee', [{ pos: closepos, range: 2 }])
            this.runStack()
          } else if (close.length == 0) {
            this.push("rangedAttack", targetID)
            this.push('moveNear', targetID)
            this.runStack()
          }
        } else {
          targetCreep = hostile.id || walls.id
        this.push('attack', targetID)
        this.push('moveNear', targetID)
        this.runStack()
        }
      } else {
        this.push('suicide')
        this.runStack()}
    }
  }
}
