// import tasks
import { Task } from '../taskManager/Task';
import { attackTargetType, TaskAttack } from '../taskManager/Creep_TaskInstances/task_attack';
import { buildTargetType, TaskBuild } from '../taskManager/Creep_TaskInstances/task_build';
import { claimTargetType, TaskClaim } from '../taskManager/Creep_TaskInstances/task_claim';
import { dismantleTargetType, TaskDismantle } from '../taskManager/Creep_TaskInstances/task_dismantle';
import { fortifyTargetType, TaskFortify } from '../taskManager/Creep_TaskInstances/task_fortify';
import { getRenewedTargetType, TaskGetRenewed } from '../taskManager/Creep_TaskInstances/task_getRenewed';
import { goToTargetType, TaskGoTo } from '../taskManager/Creep_TaskInstances/task_goTo';
import { goToRoomTargetType, TaskGoToRoom } from '../taskManager/Creep_TaskInstances/task_goToRoom';
import { harvestTargetType, TaskHarvest } from '../taskManager/Creep_TaskInstances/task_harvest';
import { healTargetType, TaskHeal } from '../taskManager/Creep_TaskInstances/task_heal';
import { meleeAttackTargetType, TaskMeleeAttack } from '../taskManager/Creep_TaskInstances/task_meleeAttack';
import { pickupTargetType, TaskPickup } from '../taskManager/Creep_TaskInstances/task_pickup';
import { rangedAttackTargetType, TaskRangedAttack } from '../taskManager/Creep_TaskInstances/task_rangedAttack';
import { TaskWithdraw, withdrawTargetType } from '../taskManager/Creep_TaskInstances/task_withdraw';
import { repairTargetType, TaskRepair } from '../taskManager/Creep_TaskInstances/task_repair';
import { reserveTargetType, TaskReserve } from '../taskManager/Creep_TaskInstances/task_reserve';
import { signControllerTargetType, TaskSignController } from '../taskManager/Creep_TaskInstances/task_signController';
import { TaskTransfer, transferTargetType } from '../taskManager/Creep_TaskInstances/task_transfer';
import { TaskUpgrade, upgradeTargetType } from '../taskManager/Creep_TaskInstances/task_upgrade';
import { dropTargetType, TaskDrop } from '../taskManager/Creep_TaskInstances/task_drop';
import { deref, derefRoomPosition } from './helperFunctions';
import { TaskInvalid } from '../taskManager/Creep_TaskInstances/task_invalid';
import { TaskTransferAll } from '../taskManager/Creep_TaskInstances/task_transferAll';
import { TaskWithdrawAll, withdrawAllTargetType } from '../taskManager/Creep_TaskInstances/task_withdrawAll';
import { TaskgoToContainer, goToContainerTargetType } from 'taskManager/Creep_TaskInstances/task_goToContainer';
//End of creep Declairations
import { RoomTask } from '../taskManager/Room_Task';
import { RTaskSpawnCreeps } from '../taskManager/Room_TaskInstances/rtask_spawnCreeps'
import { RTaskroomIdle } from 'taskManager/Room_TaskInstances/rtask_roomIdle';

export function initializeRoomTask(protoRTask: protoRoomTask): RoomTask {
	let taskName = protoRTask.name;
	let colony = protoRTask.data._colony;
	let data = protoRTask.data
	let RTask: RoomTask
	switch (taskName) {
		case RTaskSpawnCreeps.taskName:
			RTask = new RTaskSpawnCreeps(colony, data as RoomTaskData);
			break;
		case RTaskroomIdle.taskName:
			RTask = new RTaskroomIdle(colony, data as RoomTaskData);
			break;

	}
	// Set the task proto to what is in memory
	RTask.proto = protoRTask;
	// Return it
	return RTask;
}
export function initializeCreepTask(protoTask: protoTask): Task {
	// retrieve data from protoTask
	let taskName = protoTask.name // name should be build for TaskBuild
	let target = deref(protoTask._target.ref);
	let task: Task;

	// create a task object of the correct type
	switch (taskName) {
		case TaskAttack.taskName:
			task = new TaskAttack(target as attackTargetType);
			break;
		case TaskBuild.taskName:
			task = new TaskBuild(target as buildTargetType);
			break;
		case TaskClaim.taskName:
			task = new TaskClaim(target as claimTargetType);
			break;
		case TaskDismantle.taskName:
			task = new TaskDismantle(target as dismantleTargetType);
			break;
		case TaskDrop.taskName:
			task = new TaskDrop(derefRoomPosition(protoTask._target._pos) as dropTargetType);
			break;
		case TaskFortify.taskName:
			task = new TaskFortify(target as fortifyTargetType);
			break;
		case TaskGetRenewed.taskName:
			task = new TaskGetRenewed(target as getRenewedTargetType);
			break;
		case TaskGoTo.taskName:
			task = new TaskGoTo(derefRoomPosition(protoTask._target._pos) as goToTargetType);
			break;
		case TaskgoToContainer.taskName:
			task = new TaskgoToContainer(derefRoomPosition(protoTask._target._pos) as goToContainerTargetType);
			break;
		case TaskGoToRoom.taskName:
			task = new TaskGoToRoom(protoTask._target._pos.roomName as goToRoomTargetType);
			break;
		case TaskHarvest.taskName:
			task = new TaskHarvest(target as harvestTargetType);
			break;
		case TaskHeal.taskName:
			task = new TaskHeal(target as healTargetType);
			break;
		case TaskMeleeAttack.taskName:
			task = new TaskMeleeAttack(target as meleeAttackTargetType);
			break;
		case TaskPickup.taskName:
			task = new TaskPickup(target as pickupTargetType);
			break;
		case TaskRangedAttack.taskName:
			task = new TaskRangedAttack(target as rangedAttackTargetType);
			break;
		case TaskRepair.taskName:
			task = new TaskRepair(target as repairTargetType);
			break;
		case TaskReserve.taskName:
			task = new TaskReserve(target as reserveTargetType);
			break;
		case TaskSignController.taskName:
			task = new TaskSignController(target as signControllerTargetType);
			break;
		case TaskTransfer.taskName:
			task = new TaskTransfer(target as transferTargetType);
			break;
		case TaskTransferAll.taskName:
			task = new TaskTransferAll(target as transferAllTargetType);
			break;
		case TaskUpgrade.taskName:
			task = new TaskUpgrade(target as upgradeTargetType);
			break;
		case TaskWithdraw.taskName:
			task = new TaskWithdraw(target as withdrawTargetType);
			break;
		case TaskWithdrawAll.taskName:
			task = new TaskWithdrawAll(target as withdrawAllTargetType);
			break;
		default:
			console.log(`Invalid task name: ${taskName}! task.creep: ${protoTask._creep.name}. Deleting from memory!`);
			task = new TaskInvalid(target as any);
			break;
	}
	// Set the task proto to what is in memory
	task.proto = protoTask;
	// Return it
	return task;
}
