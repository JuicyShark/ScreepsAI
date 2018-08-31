
import './prototypes/Creep';
import './prototypes/Room';
import './prototypes/RoomObject'; // RoomObject
import './prototypes/RoomPosition'; // RoomPosition
import './prototypes/RoomStructures';
import './prototypes/Structures';
import { RoleHarvester } from './testRoles/harvester'
import { RoleUpgrader } from './testRoles/upgrader'
import { ErrorMapper } from "./utils/ErrorMapper";
import { isIVM } from "./utils/helperFunctions";
import { log } from "console/log";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code

function memoryInit() {
  console.log("Initing Main Memory");

}
// Decide whether to run this tick
function handler(): void {
  if (!isIVM()) {
    log.warning(`Cryptwo Screeps  requires isolated-VM to run. Change settings at screeps.com/a/#!/account/runtime`)
    return
  } if (Game.cpu.bucket < 500) {
    log.warning(`CPU bucket is critically low (${Game.cpu.bucket}) - suspending for 5 ticks`);
    Memory.suspend = 4;
    return
  } else {
    if (Memory.suspend != undefined) {
      if (Memory.suspend > 0) {
        log.info(`Operation suspended for ${Memory.suspend} more ticks`);
        return
      } else {
        delete Memory.suspend
      }
    }
    mainLoop();
  }
}

function mainLoop() {


  //Loop through all rooms your creeps/structures are in
  for (const i in Game.rooms) {

    let spawn = Game.spawns['Spawn1'];
    let creeps = _.values(Game.creeps) as Creep[];

    // Separate creeps by role
    let harvesters = _.filter(creeps, creep => creep.name.includes('Harvester'));
    let upgraders = _.filter(creeps, creep => creep.name.includes('Upgrader'));
    let patrollers = _.filter(creeps, creep => creep.name.includes('Patroller'));

    // Spawn creeps as needed
    if (harvesters.length < 3) {
      spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time);
    } else if (upgraders.length < 2) {
      spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time);
    } else if (patrollers.length < 1) {
      spawn.spawnCreep([MOVE], 'Patroller' + Game.time);
    }

    // Handle all roles, assigning each creep a new task if they are currently idle
    for (let harvester of harvesters) {
      if (harvester.isIdle) {
        RoleHarvester.newTask(harvester);
      }
    }
    for (let upgrader of upgraders) {
      if (upgrader.isIdle) {
        RoleUpgrader.newTask(upgrader);
      }
    }


    // Now that all creeps have their tasks, execute everything
    for (let creep of creeps) {
      creep.run();
    }
  }

  for (const i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
};

export const loop = ErrorMapper.wrapLoop(() => {
  mainLoop();

});
