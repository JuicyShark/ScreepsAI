declare class SpawnTask {

    room: Room;
    type: string;
    body: string[];
    memory: spawnTaskMem | null;
    constructor(room: Room, type: string, body: string[])
}
declare class SpawnBrain {

}
interface spawnTaskMem {
    home: string;
    type: string;

}
interface spawnTaskMemOpts {
    destination: string | null;
    myContainer: string | null;
    mySource: string | null;
}




interface StructureSpawn {

    addToQue(spawnTask: SpawnTask): Boolean;
    spawnNewCreep: any;
}




