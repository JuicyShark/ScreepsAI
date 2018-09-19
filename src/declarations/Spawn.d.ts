
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




