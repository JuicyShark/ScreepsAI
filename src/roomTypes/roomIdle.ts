import { Room_Tasks } from 'taskManager/Room_Tasks'



export class roomIdle {




    /**
     * RoomTask!
     * @param room Room
     */
    static newRoomTask(Colony: Colony, room: Room): void {
        var data = {
            _colony: Colony,

            roomName: room.name,
            data: {
                idleTill: (Game.time + 20)
            }

        }

        room.RoomTask = Room_Tasks.roomIdle(Colony, data as RoomTaskData)
    }
}
