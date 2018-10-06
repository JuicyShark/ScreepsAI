
import { roomTypeBase } from './roomTypeBase';

export class ColonyHub {




    /**
     * RoomTask!
     * @param room Room
     */
    static newRoomTask(Colony: Colony, room: Room): void {


        if (room.spawns[0].spawning == null) {
            if (roomTypeBase.testme(Colony, room) != null) {
                room.RoomTask = roomTypeBase.testme(Colony, room)
            }
        }




    }




}
