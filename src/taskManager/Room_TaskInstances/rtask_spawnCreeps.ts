import { RoomTask } from '../Room_Task';

export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'SpawnCreeps';

export class RTaskSpawnCreeps extends RoomTask {

    static taskName = 'SpawnCreeps';


    constructor(Colony: Colony, TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        if (!this.data || this.data.data.length == 0 || this.data.roomName == undefined || this.room.spawns.length != null) {
            return false
        }
    }

    work(): number {
        var spawnTasks: SpawnTask[] = this.data.data

        //doing shit
        if (!spawnTasks) {
            console.log("Grave error? Not defined in roomTask.data.data")

        } else if (spawnTasks.length != 0 && this.data.spawns[0] != undefined) {
            if (this.data.data.length >= 1) {
                if (this.data.spawns[0].spawning == null) {

                    return this.data.spawns[0].spawnNewCreep(this.data.data.pop())
                } else if (this.data.data.length == 0) {
                    return 0;
                } else if (this.data.spawns[0].spawning != null) {
                    return -6
                }
            }

            //work work?
        }
        else if (spawnTasks.length == 0) {
            return 0;
        }

    }

}
