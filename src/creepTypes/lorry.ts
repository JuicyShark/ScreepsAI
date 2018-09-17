import { Tasks } from '../taskManager/Tasks'

export class Lorry {


  static newTask(creep: Creep): void {
    if (creep.carry.energy != creep.carryCapacity) {

      let floorStuff = creep.room.droppedEnergy;
      let droppedItems = _.filter(floorStuff, floorStuff => floorStuff.targetedBy.length == 0)[0];
      if (droppedItems != null) {
        creep.task = Tasks.pickup(droppedItems);
      } else {
        var unattendedContainer = _.filter(creep.room.containers, container => container.isEmpty != true && container.targetedBy.length <= 2)[0];
        if (unattendedContainer == null) {
          let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 2)[0];
          creep.task = Tasks.harvest(unattendedSource)
        } else {
          creep.task = Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy)
        }
      }
    }
    else if (creep.carry.energy == creep.carryCapacity) {
      let storage = creep.room.storage;
      let extensions = creep.room.extensions;
      if (storage != undefined) {
        creep.task = Tasks.transfer(storage);
      }
      else if (extensions.length != 0) {
        for (let i in extensions) {
          if (extensions[i].energy != extensions[i].energyCapacity) {
            creep.task = Tasks.transfer(extensions[i]);
            break;
          }
        }
      }
      else {
        creep.task = Tasks.upgrade(Game.rooms[creep.memory.home].controller)
      }
    }
  }
}
