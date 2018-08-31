import { ErrorMapper } from "./utils/ErrorMapper";
import './prototypes/prototypes';
import { Tasks } from "./TaskManager/Tasks";
import * as M from "Memory"
import * as roomManager from "roomManagment/roomManager";
import {isIVM} from "./utils/helperFunctions";
import {log} from "./console/log"
import './prototypes/RoomObject'; // RoomObject
import './prototypes/RoomPosition'; // RoomPosition

export const profiler = require('screeps-profiler');
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
profiler.enable();
    
 function memoryInit(){
   console.log("Initing Main Memory");
 
 }
// Decide whether to run this tick
function handler(): void {
if (!isIVM()){
  log.warning(`Cryptwo Screeps  requires isolated-VM to run. Change settings at screeps.com/a/#!/account/runtime`)
  return
}if(Game.cpu.bucket < 500){
  log.warning(`CPU bucket is critically low (${Game.cpu.bucket}) - suspending for 5 ticks`);
  Memory.suspend = 4;
  return
}else {
  if(Memory.suspend != undefined){
    if(Memory.suspend > 0){
      log.info(`Operation suspended for ${Memory.suspend} more ticks`);
      return
    } else {
      delete Memory.suspend
    }
  }
  mainLoop();
}
}

 function mainLoop(){
  profiler.wrap(function() {

    //Loop through all rooms your creeps/structures are in
    for (const i in Game.rooms){
      const rM: any = roomManager
      const room: Room = Game.rooms[i];
      const roomMem: any = room.memory

      if(rM.isMine(room.name)){
        rM.processAsMine(room.name)
      } else {
        rM.processAsGuest(room.name)
      }


    }
    //taskManager.runCreeps()
    //taskManager.assignTasks()
    // find all towers

    });
    for (const i in Memory.creeps) {
      if (!Game.creeps[i]) {
        delete Memory.creeps[i];
      }
    }
  }
    export const loop = ErrorMapper.wrapLoop(() => {
        mainLoop();

});
