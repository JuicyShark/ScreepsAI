import { RTaskSpawnCreeps } from './Room_TaskInstances/rtask_spawnCreeps';
import { RTaskroomIdle } from './Room_TaskInstances/rtask_roomIdle';


export class Room_Tasks {

    static roomIdle(Colony: Colony, data: RoomTaskData, options = {} as RoomTaskOptions): RTaskroomIdle {
        return new RTaskroomIdle(Colony, data, options)
    }

    static spawnCreeps(Colony: Colony, data: RoomTaskData, options = {} as RoomTaskOptions): RTaskSpawnCreeps {
        return new RTaskSpawnCreeps(Colony, data, options)
    }

}
