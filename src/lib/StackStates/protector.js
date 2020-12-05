import C from '/include/constants'
import IFF from '/lib/IFF'

export default {
  protector (target, cache = {}) {

    
    /*target = { x: 25, y: 25, roomName: target }
    const tgt = this.resolveTarget(target)
    if (this.creep.pos.roomName !== tgt.roomName) {
      this.push('moveToRoom', tgt)
      this.runStack()
    }*/
    const { room, pos } = this.creep
    const walls = room.find(C.FIND_STRUCTURES, {filter: (s) =>s.structureType === STRUCTURE_WALL})
    const hostiles = room.find(C.FIND_HOSTILE_CREEPS) || room.find(C.FIND_HOSTILE_STRUCTURES || walls.length);
    const hostile = pos.findClosestByRange(hostiles || walls)
    
      if(hostiles){
        let close = pos.findInRange(FIND_HOSTILE_CREEPS, 3) || false;
        let targetCreep = this.creep.memory.target;
        
        //If they like 3 tiles away
        if(close != false && this.creep.getActiveBodyparts(RANGED_ATTACK) > 0){
          let closepos = close[0].pos
          if((close.length >= 1)){
            targetCreep = close[0].id
            this.push('rangedMassAttack')
            this.push('flee', [{ pos: closepos, range: 2 }])
            this.runStack()
          } else if (close.length == 0) {
            this.push("rangedAttack", targetCreep)
            this.push('moveNear', targetCreep)
            this.runStack()
          }
        } else {
          targetCreep = hostile.id || walls.id
        this.push('attack', targetCreep)
        this.push('moveNear', targetCreep)
        this.runStack()
        }
      } else {
        let list = list.map(({ pos: { x, y, roomName }}) => ({ pos: { x, y, roomName }, range: 5 }))
        this.push('repeat', 5, 'flee', list)
        this.runStack()
    }
  }
}
