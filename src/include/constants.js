import C from '../JuicedOS/constants.js'
export default C

C.addSegment('SPAWN')
C.addSegment('INTEL')

C.EPosisSpawnStatus = {
  ERROR: -1,
  QUEUED: 0,
  SPAWNING: 1,
  SPAWNED: 2
}

C.ENERGY_WANTED = {
  1: 0,
  2: 0,
  3: 2000,
  4: 15000,
  5: 40000,
  6: 100000
}
C.USER = Game.spawns.HomeBase
C.USERNAME = Game.spawns.HomeBase.owner.username

// Import global constants
Object.keys(global)
  .filter(k => k === k.toUpperCase())
  .forEach(k => {
    C[k] = global[k]
  })

C.RECIPES = {}
for (var a in REACTIONS) {
  for (var b in C.REACTIONS[a]) {
    C.RECIPES[C.REACTIONS[a][b]] = [a, b]
  }
}
