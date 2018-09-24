import { Tasks } from '../TaskManager/Tasks'
import { GeneralHand } from './generalhand';

export class Builder {

  static buildOrder(creep: Creep, creepTasks): any {

    if (creep.room.constructionSites.length != 0 && creep.room.constructionSites != undefined) {
      let priorityBuild: ConstructionSite<BuildableStructureConstant>[] = []
      var site = creep.room.constructionSites.forEach(function (site) {
        if (site.structureType == "container") {
          priorityBuild.push(site)
        }
        else if (site.structureType == "road") {
          priorityBuild.push(site)
        }
      })
      if (priorityBuild.length != 0) {
        creepTasks.push(Tasks.build(priorityBuild[0]));
        return creepTasks
      }
      else if (priorityBuild.length == 0) {
        creepTasks.push(Tasks.build(creep.room.constructionSites[0]));
        return creepTasks

      }
      else if (site == undefined) {
        if (creep.room.creepsByType.Upgrader == undefined && creep.room.controller.targetedBy.length >= 1) {
          creepTasks.push(Tasks.upgrade(Game.rooms[creep.memory.home].controller))
          return creepTasks
        }
      }

    }
    else {
      return GeneralHand.depositTask(creep, creepTasks)
    }

  }

  static newTask(creep: Creep): void {
    let creepTasks = [];
    if (creep.carry.energy == 0 || creep.carry.energy != creep.carryCapacity) {
      GeneralHand.harvestTask(creep, creepTasks)
    } else if (creep.carry.energy == creep.carryCapacity) {
      this.buildOrder(creep, creepTasks)
    }

    if (creepTasks.length == 1) {
      creep.task = creepTasks[0];
    }
    else if (creepTasks.length >= 2) {
      creep.task = Tasks.chain(creepTasks)
    }


  }
}
