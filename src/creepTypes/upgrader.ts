import { Tasks } from '../TaskManager/Tasks'
export class Upgrader {

  // Upgraders will harvest to get energy, then upgrade the controller
  static newTask(creep: Creep): void {
    if (creep.carry.energy != 0) {
      creep.task = Tasks.upgrade(Game.rooms[creep.memory.home].controller)
    } else {
      var unattendedContainer = _.filter(creep.room.containers, container => container.isEmpty != true && container.targetedBy.length <= 2)[0];
      if (unattendedContainer == null) {
        let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 2)[0];
        creep.task = Tasks.harvest(unattendedSource)
        if (unattendedContainer == null) {
          let unattendedSource = _.filter(creep.room.sources, source => source.targetedBy.length <= 4)[0];
          creep.task = Tasks.harvest(unattendedSource)
        } else {
          creep.task = Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy)
        }
      } else {
        creep.task = Tasks.withdraw(unattendedContainer, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy)
      }
    }
  }
}
