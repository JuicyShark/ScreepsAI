// This binds a getter/setter creep.task property
import {initializeTask} from '../utils/initializer';
import {TargetCache} from '../utils/caching';
Object.defineProperty(Creep.prototype, 'task', {
	get() {
		if (!this._task) {
			let protoTask = this.memory.task;
			this._task = protoTask ? initializeTask(protoTask) : null;
		}
		return this._task;
	},
	set(task: ITask | null) {
		// check that there is an up-to-date target cache
		TargetCache.checkCache();
		// Unregister target from old task if applicable
		let oldProtoTask = this.memory.task as protoTask;
		if (oldProtoTask) {
			let oldRef = oldProtoTask._target.ref;
			if (Game.TargetCache.targets[oldRef]) {
				_.remove(Game.TargetCache.targets[oldRef], name => name == this.name);
			}
		}
		// Set the new task
		this.memory.task = task ? task.proto : null;
		if (task) {
			if (task.target) {
				// Register task target in cache if it is actively targeting something (excludes goTo and similar)
				if (!Game.TargetCache.targets[task.target.ref]) {
					Game.TargetCache.targets[task.target.ref] = [];
				}
				Game.TargetCache.targets[task.target.ref].push(this.name);
			}
			// Register references to creep
			task.creep = this;
		}
		// Clear cache
		this._task = null;
	},
});

Creep.prototype.run = function (): number | void {
	
	if (this.task) {
		return this.task.run();
	}
};

Object.defineProperties(Creep.prototype, {
	'hasValidTask': {
		get() {
			return this.task && this.task.isValid();
		}
	},
	'isIdle'      : {
		get() {
			return !this.hasValidTask;
		}
	}
});
Object.defineProperty(Creep.prototype, 'inRampart', {
	get() {
		return !!this.pos.lookForStructure(STRUCTURE_RAMPART); // this assumes hostile creeps can't stand in my ramparts
	},
	configurable: true,
});