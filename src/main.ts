import { ErrorMapper } from "utils/ErrorMapper";
import { isIVM } from "utils/helperFunctions";
import * as config from "config";
import * as showMaster from "ShowMaster/ShowMaster";
import 'prototypes/Room';
import 'prototypes/Creep';
import 'prototypes/RoomObject'; // RoomObject
import 'prototypes/RoomPosition'; // RoomPosition
import 'prototypes/RoomStructures';
import 'prototypes/Structures';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
function runTimer(): void {
  if (!Memory.timer || Memory.timer == 0) {
    Memory.timer = 60;
  }

  if (Memory.suspend != true) {
    //If not Suspended then organise
    showMaster.organiseTimes()

  }
  console.log("Timer " + Memory.timer)
  --Memory.timer;

}
function suspendCode(): Boolean {

  if (Game.cpu.bucket < config.minBucket) {
    console.log("Checking Bucket! " + Game.cpu.bucket)
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
    console.log("DoIt")
    return
  }
  //suspendCode?
  Memory.suspend = suspendCode()
  //runTimer
  runTimer()
}



//GameLoop
export const loop = ErrorMapper.wrapLoop(() => {
  handler();

});
