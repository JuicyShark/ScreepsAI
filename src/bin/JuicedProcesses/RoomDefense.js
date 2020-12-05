import each from 'lodash-es/each'
import C from '/include/constants'
import BaseProcess from './BaseProcess'
import IFF from '/lib/IFF'
import {
  expand
} from "/etc/common"
import census from '../../lib/census'

export default class RoomDefense extends BaseProcess {
  constructor(context) {
    super(context)
    this.context = context
    this.kernel = context.queryPosisInterface('baseKernel')
    this.sleeper = this.context.queryPosisInterface('sleep')
  }

  get room() {
    return Game.rooms[this.memory.room]
  }

  get UID() {
    return ('C' + Game.time.toString(36).slice(-4) + Math.random().toString(36).slice(-2)).toUpperCase()
  }

  run() {
    this.sleeper.sleep(5)
    const room = this.room
  
    if (!room) {
      this.log.warn(`No vision in ${this.memory.room}`)
      return
    }
    if (!room.memory.underAttack) {
      room.memory.underAttack = {
        now: false,
        threat: 0,
        needDef: false
      };
    }


    census[this.room.name] = {}
    const creeps = this.room.find(FIND_MY_CREEPS)
    for (const creep of creeps) {
      census[creep.memory.group] = census[creep.memory.group] || 0
      census[creep.memory.group]++
    }

    const hostiles = room.find(FIND_HOSTILE_CREEPS).filter(({
      pos: {
        x,
        y
      }
    }) => x && x !== 49 && y && y !== 49).filter(IFF.notAlly)

    this.towerLogic(hostiles)

    if (!hostiles) {
      room.memory.underAttack.now = false;
      room.memory.underAttack.needDef = false;
      this.cleanChildren()
      return
    }
    /*hostiles.forEach(hosCreep => {
      hosCreep.get
    })*/

    if (hostiles) {
      room.memory.underAttack.now = true;
      if(room.memory.underAttack.needDef == undefined){
      room.memory.underAttack.needDef = true;
    }

    }

    //Logic for checking creeps to come... for now just quantity
    console.log("HERE ", hostiles.length, " ", census)
    this.status = "Defending Room"
    if (room.memory.underAttack.now && room.memory.underAttack.needDef) {

      let count = 0
      hostiles.forEach(hostile => {
        this.protectors("fodder", hostile)
        this.protectors("strong", hostile)
        count++
      })
      if(count >= hostiles.length){
        room.memory.underAttack.needDef = false;
      }

    }


  }


  towerLogic(hostiles) {
    if (hostiles.length) {
      const vis = this.room.visual
      //console.log('Hostiles!',hostiles.map(h=>`${h} ${h.owner.username}`))
      this.room.towers.forEach(tower => {
        if (tower.energy != 0) {
          const tgt = tower.pos.findClosestByRange(hostiles)
          tower.attack(tgt)
          vis.line(tower.pos, tgt.pos, {
            width: 0.1,
            color: '#FF0000'
          })
          vis.line(tgt.pos.x - 0.4, tgt.pos.y, tgt.pos.x + 0.4, tgt.pos.y, {
            width: 0.1,
            color: '#FF0000',
          })
          vis.line(tgt.pos.x, tgt.pos.y - 0.4, tgt.pos.x, tgt.pos.y + 0.4, {
            width: 0.1,
            color: '#FF0000',
          })
          vis.circle(tgt.pos, {
            radius: 0.4,
            fill: '#dc0000',
            stroke: '#ff0000',
            opacity: 0.3
          })
        }
      })
    } else {
      this.doTowerMaint()
    }

  }



  doTowerMaint() {
    const room = this.room
    let repairList = this.room.find(C.FIND_STRUCTURES, {
      filter: s => s.hits < (s.hitsMax / 2)
    })
    this.room.towers.forEach(tower => {
      if (tower.energy < (tower.energyCapacity / 2)) return
      const damagedStruct = repairList.pop()
      if (damagedStruct && damagedStruct.structureType != C.STRUCTURE.WALL) tower.repair(damagedStruct)
    })
  }

  protectors(type, hostile) {
    //eventually we want to probably spawn a creep to head the direction the attack is coming from to see if there is another wave inbound.

    var cid;
    switch (type) {
      case "fodder":
        cid = this.ensureCreep(`${hostile.id}Fodder`, {
          rooms: [room.roomName],
          body: [
            expand([4, C.TOUGH, 1, C.ATTACK, 3, C.MOVE]), //200 energy
            expand([8, C.TOUGH, 1, RANGED_ATTACK, 1, C.ATTACK, 4, C.MOVE]) //450energy
          ],
          priority: 1
        })
        return this.ensureChild(`protector${hostile.id}_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', room.roomName]
        })

      case "strong":
        cid = this.ensureCreep(`${hostile.id}StrongMans`, {
          rooms: [room.roomName],
          body: [
            expand([8, C.TOUGH, 2, C.ATTACK, 2, C.MOVE]),
            expand([8, C.TOUGH, 2, RANGED_ATTACK, 3, C.ATTACK, 3, C.MOVE])
          ],
          priority: 1
        })
        return this.ensureChild(`protector${hostile.id}_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', room.roomName]
        })

      default:
        cid = this.ensureCreep(`protector_${hostile.id}1`, {
          rooms: [room.roomName],
          body: [
            expand([2, C.TOUGH, 2, C.ATTACK, 2, C.MOVE]),
            expand([4, C.TOUGH, 2, C.ATTACK, 4, C.MOVE])
          ],
          priority: 1
        })
        return this.ensureChild(`protector${hostile.id}_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', room.roomName]
        })

    }

    //Needs to be more dynamic




  }


  toString() {
    return this.memory.room
  }
}