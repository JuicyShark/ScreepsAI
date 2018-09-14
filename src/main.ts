import 'prototypes/Room';
import 'prototypes/Creep';
import 'prototypes/RoomObject'; // RoomObject
import 'prototypes/RoomPosition'; // RoomPosition
import 'prototypes/RoomStructures';
import 'prototypes/Structures';
import 'prototypes/Spawn';
import { ErrorMapper } from "utils/ErrorMapper";
import { isIVM } from "utils/helperFunctions";
import * as config from "config";
import profiler from './utils/screeps-profiler';
import { checkColonys } from './Colony'
import { RoomBrain } from './ShowMaster/roomMaster';
import { setCreepTasks } from './ShowMaster/creepMaster';


profiler.enable();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code

function suspendCode(): Boolean {
  console.log(Game.cpu.getUsed().toString().slice(0, 6) + "/" + Game.cpu.limit + " Used")
  if (Game.cpu.bucket < config.minBucket) {
    console.log("Checking Bucket! " + Game.cpu.bucket)
    console.log(Game.cpu.limit + " | tickLim " + Game.cpu.tickLimit)
    return true;
  }
  else if (Game.cpu.bucket > config.safeBucketLimit) {
    return false;
  }
  else {
    return false;
  }
}
function handler(): void {
  //checks if IsolatedVirtualMachine
  if (!isIVM()) {
    console.log(`Cryptwo Screeps  requires isolated-VM to run. Change settings at screeps.com/a/#!/account/runtime`)
    return
  }
  //suspendCode?
  Memory.suspend = suspendCode()
  if (Memory.suspend != true) {
    main()
  }
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

function main(): void {
  if (Game.colonies == undefined || Game.colonies === null) {
    //console.log("ITS UNDEFINED")
    Game.colonies = [];
    if (!Memory.Colonies) {
      Memory.Colonies = [];
    }
    //console.log(JSON.stringify(Game.colonies))
    checkColonys();
    //console.log(Game.colonies + " After")
    //console.log(Game.colonies.length + " IS LENGTH OF COLONIES")
  }


  if (Game.colonies.length >= 1) {
    RoomBrain.run();
    for (let i in Game.colonies) {
      let Colony = Game.colonies[i];
      console.log("====")
      console.log("Colony ID: " + Colony.id)
      console.log("Colony Name: " + Colony.name)
      setCreepTasks(Colony)
      RoomBrain.runTimer(Colony)
    }

  } else {
    console.log("Nothings good with the Colonies ATM D:")
    console.log("Colony Object :" + JSON.stringify(Game.colonies))
  }

}
//GameLoop
export const loop = ErrorMapper.wrapLoop(() => {

  profiler.wrap(handler);

});
