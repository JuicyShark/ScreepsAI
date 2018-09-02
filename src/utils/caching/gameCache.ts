
// Caches targets every tick to allow for RoomObject.targetedBy property
export class GameCache implements ICache {

    creepsByColony: { [colonyName: string]: Creep[] };
    targets: { [ref: string]: string[] };
    outpostFlags: Flag[];
    tick: number;

    constructor() {
        this.creepsByColony = {}
        this.targets = {};
        this.tick = Game.time
    }

    private cacheCreepsByColony() {
        this.creepsByColony = _.groupBy(Game.creeps, creep => creep.memory.colony) as { [colName: string]: Creep[] };
    }
    // Generates a hash table for targets: key: TargetRef, val: targeting creep names
    private cacheTargets() {
        this.targets = {};
        for (let i in Game.creeps) {
            let creep = Game.creeps[i];
            let task = creep.memory.task;
            // Perform a faster, primitive form of _.map(creep.task.manifest, task => task.target.ref)
            while (task) {
                if (!this.targets[task._target.ref]) this.targets[task._target.ref] = [];
                this.targets[task._target.ref].push(creep.name);
                task = task._parent;
            }
        }
    }
    // Check that there is an up-to-date target cache
    static checkCache() {
        if (!(Game.TargetCache && Game.TargetCache.tick == Game.time)) {
            Game.TargetCache = new GameCache();
            Game.TargetCache.build();
        }
    }
    // Build the target cache
    build() {
        this.cacheCreepsByColony();
        this.cacheTargets();
    }
    refresh() {
        this.cacheCreepsByColony();
        this.cacheTargets();
    }
}
