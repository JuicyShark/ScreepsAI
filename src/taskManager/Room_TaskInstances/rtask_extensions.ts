import { RoomTask } from '../Room_Task';

export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'extensions';

export class RTaskextensions extends RoomTask {

    static taskName = 'extensions';


    constructor(Colony: Colony, TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(Colony, TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        if (!this.data) {
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


        return output

    }

}
