import { RoomTask } from '../Room_Task';

export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'RoomIdle';

export class RTaskroomIdle extends RoomTask {

    static taskName = 'RoomIdle';


    constructor(Colony: Colony, TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(TaskName, TaskData);
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
        var dataPack: RoomTaskData = this.data

        //needs to return 0
        if (Game.time >= dataPack.data.idleTill) {
            return 0;
        }
        else {
            return -1;
        }

    }

}
