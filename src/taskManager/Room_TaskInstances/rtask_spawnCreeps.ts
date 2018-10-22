import { RoomTask } from '../Room_Task';
import { creepTypes } from 'config';

export const TaskName = 'SpawnCreeps';

export class RTaskSpawnCreeps extends RoomTask {

    static taskName = 'SpawnCreeps';


    constructor(Colony: Colony, TaskData: SpawnTaskData, options = {} as RoomTaskOptions) {
        super(Colony, TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        var spawnTaskData = this.data as SpawnTaskData;
        var spawnTasks: SpawnTask[] = this.data.data;
        var output: boolean = false;
        if (!spawnTaskData || spawnTaskData.spawns.length == 0 || spawnTasks == null || spawnTaskData.roomName == undefined) {
            output = false
        }

        if (spawnTasks instanceof Array && spawnTasks.length >= 1) {
            output = true
        } else if (spawnTasks instanceof Array && spawnTasks.length == 0) {
            output = false
        }

        if (output) {
            return true
        }
        else {
            // Switch to parent task if there is one
            var isValid = output;
            if (this.parent) {
                isValid = this.parent.isValid();
            }
            this.finish();
            return isValid;
        }

    }

    work(): number {

        var output = -5;
        const spawnTaskData = this.data as SpawnTaskData;
        const spawnTasks: SpawnTask[] = this.data.data;
        const spawn: StructureSpawn | null = Game.spawns[(spawnTaskData.spawns[0])]
        if (spawn == null) {
            console.log("NULL")
            return - 9;
        }
        if (spawnTasks instanceof Array) {
            if (spawnTasks.length == 0) {
                output = -1;
            }
            else if (spawnTasks.length >= 1) {
                let spawnData = spawnTasks[0]
                switch (spawn.spawnNewCreep(spawnData)) {
                    case 0:
                        if (spawnTasks.length >= 2) {
                            spawnTaskData.leftToSpawn = spawnTaskData.leftToSpawn--
                            spawnTasks.splice(0)
                            output = -2;
                            break;
                        }
                        else if (spawnTasks.length == 1) {
                            spawnTaskData.leftToSpawn = spawnTaskData.leftToSpawn--;
                            spawnTasks.splice(0)
                            output = OK;
                            break;
                        }
                    case -4: // BUSY
                        //console.log("SPAWN BUSY")
                        output = -4;
                        break;
                    case -6: //Not Enough Energy
                        //console.log("Not enough Energy")
                        output = -6
                        break;
                }
            }
            if (spawn.spawning != null) {
                output = -2;
            }
            if (output == -1) {
                this.isValidRoomTask();
            }
            return output
        }
    }
}


