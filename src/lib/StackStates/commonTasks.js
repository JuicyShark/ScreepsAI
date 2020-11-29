import C from '/include/constants'

export default {
    buildAt (type, target, opts = {}) {
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

      store (res,cache = {}) {
        if (!cache.work) {
          cache.work = this.creep.getActiveBodyparts(C.WORK)
        }
        if (!this.creep.carry[res]) {
          this.pop()
          return this.runStack()
        }
        if (cache.work) {
          const road = this.creep.pos.lookFor(C.LOOK_STRUCTURES).find(s => s.structureType === C.STRUCTURE_ROAD)
          if (road != undefined && road.hits < road.hitsMax / 2) {
            this.creep.repair(road)
          }
          let cs = this.pos.lookFor(C.LOOK_CONSTRUCTION_SITES).find(s=>s.structureType === C.STRUCTURE_ROAD)
          if (cs) {
            return this.build(cs)
          }
        }
        let [container] = this.creep.room.lookNear(C.LOOK_STRUCTURES, C.USER.pos)
        .filter((s) => s.structureType === C.STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity)
        let tgt = this.creep.room.storage || container || this.creep.room.spawns.find(s => s.energy < s.energyCapacity) || this.creep.room.extensions.find(s => s.energy < s.energyCapacity)
        if (tgt) {
          this.push('transfer', tgt.id, res)
          this.push('moveNear', tgt.id)
          return this.runStack()
        }
    },
        moveToRoom (target) {
        let tgt = this.resolveTarget(target)
        if (this.creep.pos.roomName === tgt.roomName) {
          this.pop()
          this.runStack()
        } else {
          this.creep.travelTo(tgt)
        }
      },
      travelTo (target, opts = {maxOps: 3000}) {
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
      moveNear (target, opts = {maxOps: 1500}) {
        if (typeof opts.roomCallback === 'string') {
          opts.roomCallback = new Function(opts.roomCallback)
        }
        let tgt = this.resolveTarget(target)
        if (this.creep.pos.isNearTo(tgt)) {
          this.pop()
          this.runStack()
        } else {
          this.creep.travelTo(tgt, opts)
        }
      },
      moveInRange (target, range) {
        let tgt = this.resolveTarget(target)
        if (this.creep.pos.inRangeTo(tgt, range)) {
          this.pop()
          this.runStack()
        } else {
          this.creep.travelTo(tgt)
        }
      },
      flee (targets) {
        let { path } = PathFinder.search(this.creep.pos, targets, { 
          flee: true,
          roomCallback (room) {
            let cm = new PathFinder.CostMatrix()
            for(let i = 0; i < 2500; i++) {
              cm._bits[i] = 0
            }
            let r = Game.rooms[room]
            if (r) {
              r.structures.all.forEach(({ structureType, pos: { x, y } }) => {
                if (OBSTACLE_OBJECT_TYPES.includes(structureType)) {
                  cm.set(x,y,254)
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