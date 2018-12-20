export class SpawnTask {

    roomName: string;
    type: string;
    creepName: string;
    body: BodyPartConstant[];
    memory: any;

    constructor(roomName: string, type: string, body: BodyPartConstant[], creepName: string, options = {} as any) {
        this.roomName = roomName;
        this.type = type;
        this.creepName = creepName;
        this.body = body;


        if (options == null) {
            this.memory = {
                type: type,
                home: roomName,
                destination: null
            };
        }
        else {
            this.memory = {
                type: type,
                home: roomName,
                destination: options.destination,
                myContainer: options.myContainer,
                mySource: options.mySource
            };
        }
    };

    spawnNewCreep(spawn: StructureSpawn): number {
        var testCreep: number = spawn.spawnCreep(this.body, this.creepName, {
            dryRun: true
        });
        return testCreep

    }
}

StructureSpawn.prototype.spawnNewCreep = function (spawnTask: SpawnTask): number {

    var testCreep: number = this.spawnCreep(spawnTask.body, spawnTask.creepName, {
        dryRun: true
    });

    if (testCreep == 0) {
        this.spawnCreep(spawnTask.body, spawnTask.creepName + Game.time, { memory: spawnTask.memory });
        this.room.memLog = ("Spawning a " + spawnTask.type + ", named " + spawnTask.creepName);
    }
    return testCreep
};
