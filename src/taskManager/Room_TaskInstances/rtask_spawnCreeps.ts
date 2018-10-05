import { RoomTask } from '../Room_Task';

export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'SpawnCreeps';

export class RTaskSpawnCreeps extends RoomTask {

    static taskName = 'SpawnCreeps';


    constructor(TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        if (this.data.room == undefined || this.data.room.spawns.length == null) {
            return false
        }
    }

    work(): number {
        var spawnTask: SpawnTask = this.data.data

        //doing shit
        if (!spawnTask) {

        } else {
            if (this.data.room.spawns != undefined || this.data.room.spawns != null) {
                if (this.data.room.spawns.length >= 2) {

                } else if (this.data.room.spawns.length == 1 && this.data.room.spawns[0].spawning == null) {

                    if (Game.rooms[this.data.room.name].spawns[0].spawnNewCreep(spawnTask) == 0) {
                        if (this.data.room.spawns[0].spawning == null) {

                            return 0
                        }
                    }
                }
            }
        }
    }

}
