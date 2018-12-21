import { RoomTask } from '../Room_Task';

export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'Towers';

export class RTaskroomIdle extends RoomTask {

    static taskName = 'Towers';


    constructor(Colony: Colony, TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(Colony, TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        if (!this.data || !this.data.data.idleTill) {
            return false
        }
        else {
            return true
        }
    }

    work(): number {
        var output = -5;
        var dataPack: RoomTaskData = this.data

        //needs to return 0
        if (Game.time == dataPack.data.idleTill || Game.time > dataPack.data.idleTill) {
            console.log("ROOM DONE IDLE")
            output = 0;
        }
        else {
            console.log(Game.time, " ", dataPack.data.idleTill)
            output = -2;
        }

        return output

    }

}
