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
        if (!spawnTaskData || spawnTaskData.leftToSpawn <= 0 || spawnTasks == null || spawnTaskData.roomName == undefined) {
            return false
        }
    }

    work(): number {
        var output = -5;
        var spawnTaskData = this.data as SpawnTaskData;
        var spawnTasks: SpawnTask[] = this.data.data;
        var spawns: StructureSpawn[] = spawnTaskData.spawns;

        if (spawnTasks instanceof Array) {
            if (spawnTasks.length == 0) {
                output = OK;
            }
            else if (spawnTasks.length >= 1 && spawns[0].spawning == null) {
                if (spawns[0] instanceof StructureSpawn) {

                    let spawnData = spawnTasks.pop()
                    if (spawns[0].spawnNewCreep(spawnData) == 0) {
                        spawnTaskData.leftToSpawn = (spawnTaskData.leftToSpawn - 1)
                        output = OK
                    }
                }

            }
            else if (spawns[0].spawning != null) {
                output = -1;
            }
        }

        return output
    }
}
