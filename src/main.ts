import "prototypes/RoomPosition"
import "prototypes/Creep"
import "prototypes/Room"
import "prototypes/Spawn"
import "prototypes/RoomStructures"
import "prototypes/RoomObject"
import { ErrorMapper } from "utils/ErrorMapper"
import * as config from "config"
import { isIVM } from "utils/helperFunctions"
import { checkColonys } from "./Colony"
import { runCreeps } from "./brainGroup/creepLobe"

// Profiler
import profiler from './utils/screeps-profiler'
//

//End imports



//end declairations



// functions
/**Checks if we need to suspend code */
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
/**
 * Checks if its a IsolatedVirtualMachine and if we need to suspend or run the code.
 */
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
/**
 * Main function block
 */
function main(): void {
  if (Game.colonies == undefined || Game.colonies === null) {
    Game.colonies = [];
    if (!Memory.Colonies) {
      Memory.Colonies = [];
    }
    checkColonys();
  }


  if (Game.colonies.length >= 1) {

    for (let i in Game.colonies) {
      var Colony = Game.colonies[i];
      Colony.run()
      let room: Room = Colony.room
      room.run(Colony.id)
    }
    runCreeps()
  } else {
    console.log("Colonies are currently malfunctioning")
  }

}

//GameLoop
export const loop = ErrorMapper.wrapLoop(() => {

  profiler.wrap(handler);


});



//end functions


//script
