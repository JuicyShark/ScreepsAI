import { Task } from '../Task';
import { isSource } from '../../declarations/typeGuards'

export type harvestTargetType = Source | Mineral;
export const minerTaskName = 'mine';

export class TaskMine extends Task {

    static taskName = 'mine';
    target!: harvestTargetType;

    constructor(target: harvestTargetType, options = {} as TaskOptions) {
        super(minerTaskName, target, options);
    }

    isValidTask() {
        return _.sum(this.creep.carry) < this.creep.carryCapacity;
    }

    isValidTarget() {
        if (isSource(this.target)) {
            return this.target.energy > 0;
        } else {
            return this.target.mineralAmount > 0;
        }
    }

    work() {
        return this.creep.harvest(this.target);
    }
}
