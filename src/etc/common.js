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
export function findStorage(room, resourceType){
  let roomSpawn = room.room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_SPAWN }
  })
  let tgt
    console.log(`${roomSpawn}, ${roomSpawn[0]}`)
    if(roomSpawn[0]){
      let [container] = room.room.find(C.FIND_STRUCTURES, { 
        filter: (s) => s.structureType === C.STRUCTURE_CONTAINER && s.store[resourceType] < s.storeCapacity})
        tgt = room.room.storage || container || room.room.spawns.find(s => s.energy < s.energyCapacity) || room.room.extensions.find(s => s.energy < s.energyCapacity)
        console.log(`target found ${tgt}`)
    }
    else {
      this.log.warn(`fallback needed`)
      let [container] = C.USER.room.find(C.FIND_STRUCTURES, { 
        filter: (s) => s.structureType === C.STRUCTURE_CONTAINER && s.store[resourceType] < s.storeCapacity})
        tgt = C.USER.room.storage || container || C.USER.room.spawns.find(s => s.energy < s.energyCapacity) || C.USER.room.extensions.find(s => s.energy < s.energyCapacity)
    }
    return tgt
  }
  
  export function findIfSurplus(room) {
    const stored = room.storage && room.storage.store.energy || false
    let amount
    if (!stored) {
      let containers = room.find(C.FIND_STRUCTURES).filter((s) => s.structureType === C.STRUCTURE_CONTAINER)
      if(!containers.length) {
        return 0 }
      let containersFull = 0 
      for (let i in containers) {
        let container = containers[i]
        if (container.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
          containersFull++
        } else continue
      }
      amount = containersFull
    } else {
      if(stored > 200000) amount = stored / 200000
      else amount = 0
    }
    return amount / 1.5
  }