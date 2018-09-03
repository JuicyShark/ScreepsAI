
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

        var ColonyRooms = Object.entries(Memory.Colonies.ColonyRooms)
        console.log(ColonyRooms.length)
        for (let i = 0; i < ColonyRooms.length; i++) {
            let roomName: string = ColonyRooms[i][0]
            let roomObj = ColonyRooms[i][1]
            if (ColonyRooms[i][0] != "") {
                roomMaster.initStructures(roomName)

            }
        }

        /* var ColonyRoomNames = Object.keys(Memory.Colonies.ColonyRooms)
         var ColonyRooms = Object.values(Memory.Colonies.ColonyRooms)
         console.log(ColonyRooms)
         ColonyRooms.forEach(function (value: [string, {}], index: number, array: [string, {}][]): void {
             let room: string = Memory.Colonies.ColonyRoomNames[index];
             console.log(room)
             if (room != undefined) {
                 console.log("INITIn")
                 roomMaster.initStructures(room)
                 roomMaster.initContainers(room)
             }
         });*/
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

