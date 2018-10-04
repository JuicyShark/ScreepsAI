import { RTaskSpawnCreeps } from './Room_TaskInstances/rtask_spawnCreeps';


export class Room_Tasks {

    static spawnCreeps(data: RoomTaskData, options = {} as RoomTaskOptions): RTaskSpawnCreeps {
        return new RTaskSpawnCreeps(data, options)
    }

}
