
declare class SpawnTask {

    CreatedBy: string;
    type: string;
    body: string[];
    memory: Object | null;
    constructor(CreatedBy: string, tyoe: string, body: string[])
}
interface spawnTaskMem extends SpawnTask {
    home: string;
    type: string;
    body: string[];

}
interface spawnTaskMemOpts extends spawnTaskMem {
    Destination: string | null;
    myContainer: string | null
}




interface StructureSpawn {

    addToQue(spawnTask: SpawnTask): Boolean;
    spawnNewCreep: any;
}




