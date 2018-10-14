import { RoomTask } from '../Room_Task';

export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'SpawnCreeps';

export class RTaskSpawnCreeps extends RoomTask {

    static taskName = 'SpawnCreeps';


    constructor(Colony: Colony, TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        if (!this.data || this.data.data.length == 0 || this.data.roomName == undefined || this.room.spawns.length == 0) {
            return false
        }
    }

    work(): number {
        var spawnTasks: SpawnTask[] = this.data.data
        let spawn: StructureSpawn = this.data.spawns[0]

        //doing shit
        if (!spawnTasks) {
            return 0;

        } else if (spawnTasks.length != 0 && spawn != undefined) {
            if (this.data.data.length >= 1) {
                if (spawn.spawning == null) {
                    let spawnData = this.data.data.pop()

                    return spawn.spawnNewCreep(spawnData)
                } else if (this.data.data.length == 0) {
                    return 0;
                } else if (spawn.spawning != null) {
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
