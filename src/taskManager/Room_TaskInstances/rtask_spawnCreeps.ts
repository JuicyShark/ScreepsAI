import { RoomTask } from '../Room_Task';

export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'SpawnCreeps';

export class RTaskSpawnCreeps extends RoomTask {

    static taskName = 'SpawnCreeps';


    constructor(TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(TaskName, TaskData);
    }

    isValidRoomTask() {
        return (this._room != undefined)
    }

    work() {
        let spawnTask: SpawnTask = this.data.data

        //doing shit
        if (!spawnTask) {
            if (spawnTask.CreatedBy == this._room.name) {
                if (this._room.spawns.length >= 2) {

                } else if (this._room.spawns.length == 1 && this._room.spawns[0].spawning != null) {
                    return this._room.spawns[0].spawnNewCreep(spawnTask)
                }
            }
        }
    }

}
