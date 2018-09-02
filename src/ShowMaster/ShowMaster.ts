
import * as config from "config";
import * as roomMaster from '../ShowMaster/roomMaster';
import { runCreeps } from '../ShowMaster/creepMaster';


function initMemory(): void {
    if (!Memory.Colonies) {
        Memory.Colonies = config.defaultColoniesMem()
    }
}

export function organiseTimes(): void {
    let timer = Memory.timer;
    if (timer == 59) {
        initMemory()
    }

    //every 5 Game ticks
    if (timer % 5 === 0) {
        roomMaster.shotCaller();
    }

    if (timer % 14 === 0) {
        //On Ticks 14,28,42,56

    }

    //Every tick do the following
    runCreeps();

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
}

export function checkRooms(): any {


}

