import { RTaskSpawnCreeps } from './Room_TaskInstances/rtask_spawnCreeps';


export class Room_Tasks {

    static spawnCreeps(Colony: Colony, data: RoomTaskData, options = {} as RoomTaskOptions): RTaskSpawnCreeps {
        return new RTaskSpawnCreeps(Colony, data, options)
    }

}
