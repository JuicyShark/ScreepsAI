import { RTaskSpawnCreeps } from './Room_TaskInstances/rtask_spawnCreeps';
import { RTaskroomIdle } from './Room_TaskInstances/rtask_roomIdle';
import { RTaskextensions } from './Room_TaskInstances/rtask_extensions';


export class Room_Tasks {

	static chain(tasks: RTask[]): RTask | null {
		if (tasks.length == 0) {
			return null;
		}

		// Make the accumulator task from the end and iteratively fork it
		let task = _.last(tasks); // start with last task
		tasks = _.dropRight(tasks); // remove it from the list
		for (let i = (tasks.length - 1); i >= 0; i--) { // iterate over the remaining tasks
			task = task.fork(tasks[i]);
		}
		return task;
	}


	static roomIdle(Colony: Colony, data: RoomTaskData, options = {} as RoomTaskOptions): RTaskroomIdle {
		return new RTaskroomIdle(Colony, data, options)
	}

	static spawnCreeps(Colony: Colony, data: SpawnTaskData, options = {} as RoomTaskOptions): RTaskSpawnCreeps {
		return new RTaskSpawnCreeps(Colony, data, options)
	}

	static extentions(Colony: Colony, data: RoomTaskData, options = {} as RoomTaskOptions): RTaskextensions {
		return new RTaskextensions(Colony, data, options)
	}

}
