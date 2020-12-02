import C from '/include/constants'
import {
  findStorage
} from '/etc/common'

export default {
  /** 
   *  build structure at
   * @param type: type of structure to be built
   * @param target: target area to head towards or build at
   * @param opts: any movement options to add
   * */
  buildAt(type, target, opts = {}) {
    if (!opts.work) {
      opts.work = this.creep.getActiveBodyparts(C.WORK)
    }
    const tgt = this.resolveTarget(target)
    if (this.creep.carry.energy) {
      let [site] = tgt.lookFor(C.LOOK_CONSTRUCTION_SITES)
      if (!site) {
        let [struct] = tgt.lookFor(C.LOOK_STRUCTURES, {
          filter: (s) => s.structureType === type
        })
        if (struct) { // Structure exists/was completed
          this.pop()
          return this.runStack()
        }
        this.creep.say('CSITE')
        return tgt.createConstructionSite(type)
      }
      let hitsMax = Math.ceil(sum(values(this.creep.carry)) / (opts.work * C.BUILD_POWER))
      this.push('repeat', hitsMax, 'build', site.id)
      this.runStack()
    } else {
      if (opts.energyState) {
        this.push(...opts.energyState)
        this.runStack()
      } else {
        this.creep.say('T:BLD GTHR')
        this.pop()
      }
    }
  },
  /** 
   *  store a resource 
   * @param res: resource to store
   * @param cache: cache of body parts (work gets found)
   * */
  store(res, cache = {}) {
    //grab work parts and store in cache.work
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C.WORK)
    }
    // if creep is not carrying resource specified
    if (!this.creep.carry[res]) {
      this.pop()
      return this.runStack()
    }
    // find a target via findStorage
    let tgt = findStorage(this.creep)
    if (tgt) {
      this.push('transfer', tgt.id, res)
      this.push('moveNear', tgt.id)
      return this.runStack()
    }
  },
  /** 
   *  Move to room
   * @param target: target area/object to travel too
   * */
  moveToRoom(target) {
    //if not handed room pos create one from target
    let tgt = this.resolveTarget(target)
    if (this.creep.pos.roomName === tgt.roomName) {
      this.pop()
      this.runStack()
    } else {
      this.creep.travelTo(tgt)
    }
  },
  /** 
   *  travel to logic
   * @param target: target area/object to travel too
   * */
  travelTo(target, opts = {
    maxOps: 3000
  }) {
    if (typeof opts.roomCallback === 'string') {
      opts.roomCallback = new Function(opts.roomCallback)
    }
    const tgt = this.resolveTarget(target)
    if (this.creep.pos.isEqualTo(tgt)) {
      this.pop()
      this.runStack()
    } else {
      this.creep.travelTo(tgt, opts)
    }
  },
  /** 
   *  Move near
   * @param target: target area/object to travel near
   * @param opts: specify further options
   * */
  moveNear(target, opts = {}) {
    if (typeof opts.roomCallback === 'string') {
      opts.roomCallback = new Function(opts.roomCallback)
    }
    //if not handed room pos create one from target
    let tgt = this.resolveTarget(target)
    //is creep close to tgt?
    if (this.creep.pos.isNearTo(tgt)) {
      this.pop()
      this.runStack()
    } else {
      this.creep.moveTo(tgt, opts)
    }
  },
  /** 
   *  Move in range of
   * @param target: target to get in range of
   * @param range: how close to get to the target
   * */
  moveInRange(target, range) {
    //if not handed room pos create one from target
    let tgt = this.resolveTarget(target)
    if (this.creep.pos.inRangeTo(tgt, range)) {
      this.pop()
      this.runStack()
    } else {
      this.creep.travelTo(tgt)
    }
  },
  /** 
   *  run away from
   * @param targets: targets to avoid at all costs
   * */
  flee(targets) {
    let {
      path
    } = PathFinder.search(this.creep.pos, targets, {
      flee: true,
      roomCallback(room) {
        let cm = new PathFinder.CostMatrix()
        for (let i = 0; i < 2500; i++) {
          cm._bits[i] = 0
        }
        let r = Game.rooms[room]
        if (r) {
          r.structures.all.forEach(({
            structureType,
            pos: {
              x,
              y
            }
          }) => {
            if (OBSTACLE_OBJECT_TYPES.includes(structureType)) {
              cm.set(x, y, 254)
            }
          })
        }
        return cm
      }
    })
    if (path && path.length) {
      this.creep.moveByPath(path)
    }
    this.pop()
  }
}