declare class SpawnTask {

    CreatedBy: string;
    type: string;
    body: string[];
    memory: spawnTaskMem | null;
    constructor(CreatedBy: string, tyoe: string, body: string[])
}
interface spawnTaskMem {
    home: string;
    type: string;

}
interface spawnTaskMemOpts {
    destination: string | null;
    myContainer: string | null
}




interface StructureSpawn {

    addToQue(spawnTask: SpawnTask): Boolean;
    spawnNewCreep: any;
}




