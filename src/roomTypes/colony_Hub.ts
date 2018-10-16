import { Room_Tasks } from '../TaskManager/Room_Tasks'
import { roomTypeBase } from './roomTypeBase';
import { allCreepTypes } from '../creepTypes/allTypes'

export class ColonyHub {




    /**
     * RoomTask!
     * @param room Room
     */
    static newRoomTask(Colony: Colony, room: Room): void {
        const creepTypes = allCreepTypes.level1Types

        if (Colony.creepsByType.GeneralHand == undefined || Colony.creepsByType.GeneralHand.length < creepTypes.GeneralHand.creepAmmount[room.controller.level]) {
            if (roomTypeBase.spawnBasicCreeps(Colony, room) != null) {
                room.RoomTask = roomTypeBase.spawnBasicCreeps(Colony, room)
            }

        }
        else if (Colony.creepsByType.GeneralHand.length == creepTypes.GeneralHand.creepAmmount[room.controller.level]) {
            let data = {
                _colony: Colony,
                roomName: room.name,
                data: {
                    idleTill: (Game.time + 20)
                }

            }
            room.RoomTask = Room_Tasks.roomIdle(Colony, data as RoomTaskData);
        }
    }




}





