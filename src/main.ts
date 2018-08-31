import { ErrorMapper } from "./utils/ErrorMapper";
import './prototypes/prototypes';
import { Tasks } from "./TaskManager/Tasks";
import * as M from "./memory"
import * as roomManager from "roomManager";

import { StructureTower } from "prototypes/prototype.tower";

const profiler = require('screeps-profiler');
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
profiler.enable();
    
 function memoryInit(){
   console.log("Initing Main Memory");
   
   delete Memory.flags
   delete Memory.spawns
   delete Memory.rooms
   delete Memory.creeps
   
  const mem = M.m();
  mem.creeps = {}
  mem.rooms = {}
  mem.uuid = 0
 }

 function mainLoop()
 {
  profiler.wrap(function() 
  {
    if(M.m().memVersion === undefined || M.m().memVersion !== M.memVersion)
   {
     memoryInit();
   }
if(!M.m().uuid || M.m().uuid > 1000)
{
  M.m().uuid = 0
}
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

});
