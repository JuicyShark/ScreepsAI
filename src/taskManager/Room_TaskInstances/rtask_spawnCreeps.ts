import { RoomTask } from '../Room_Task';

export const TaskName = 'SpawnCreeps';

export class RTaskSpawnCreeps extends RoomTask {

    static taskName = 'SpawnCreeps';


    constructor(Colony: Colony, TaskData: SpawnTaskData, options = {} as RoomTaskOptions) {
        super(TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        var spawnTaskData = this.data as SpawnTaskData;
        var spawnTasks: SpawnTask[] = this.data.data;
        var spawns: StructureSpawn[] = spawnTaskData.spawns;
        if (!spawnTaskData || spawnTasks == null || spawnTaskData.roomName == undefined) {
            return false
        }
    }

    work(): number {
        var spawnTaskData = this.data as SpawnTaskData;
        var spawnTasks: SpawnTask[] = this.data.data;
        var spawns: StructureSpawn[] = spawnTaskData.spawns;

        if (spawnTasks instanceof Array) {
            if (spawnTasks.length == 0) {
                return OK;
            }
            else if (spawnTasks.length >= 1 && spawns[0].spawning == null) {
                if (spawns[0] instanceof StructureSpawn) {

                    let spawnData = spawnTasks.pop()
                    return spawns[0].spawnNewCreep(spawnData)
                }

            }
            else if (spawns[0].spawning != null) {
                return -1;
            }
        }


    }
}
