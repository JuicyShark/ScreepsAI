export function expand(body){
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
export function findStorage(room){
  let roomSpawn = room.room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_SPAWN }
  })
  let tgt
    if(roomSpawn){
      let [container] = room.room.find(C.FIND_STRUCTURES, { 
        filter: (s) => s.structureType === C.STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity})
        tgt = room.room.storage || container || room.room.spawns.find(s => s.energy < s.energyCapacity) || room.room.extensions.find(s => s.energy < s.energyCapacity)
    }
    else {
      this.log.warn(`fallback needed`)
      let [container] = C.USER.room.find(C.FIND_STRUCTURES, { 
        filter: (s) => s.structureType === C.STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity})
        tgt = C.USER.room.storage || container || C.USER.room.spawns.find(s => s.energy < s.energyCapacity) || C.USER.room.extensions.find(s => s.energy < s.energyCapacity)
    }
    return tgt
  }