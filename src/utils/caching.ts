
// Caches targets every tick to allow for RoomObject.targetedBy property

export class TargetCache {
    targets: { [ref: string]: string[] };
    tick: number;

    constructor() {
        this.targets = {};
        this.tick = Game.time
    }
    // Generates a hash table for targets: key: TargetRef, val: targeting creep names
    private cacheTargets() {
        this.targets = {};
        for (let i in Game.creeps) {
            let creep = Game.creeps[i];
            let task = creep.memory.task;

            while (task) {
                if (!this.targets[task._target.ref]) {
                    this.targets[task._target.ref] = [];
                    this.targets[task._target.ref].push(creep.name)
                    task = task._parent;
                }
            }
        }
    }
    // Check that there is an up-to-date target cache
    static checkCache() {
        if (!(Game.TargetCache && Game.TargetCache.tick == Game.time)) {
            Game.TargetCache = new TargetCache();
            Game.TargetCache.build();
        }
    }
    // Build the target cache
    build() {
        this.cacheTargets();
    }
}