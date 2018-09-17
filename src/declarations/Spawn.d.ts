interface StructureSpawn {
    addToQue(spawnTask: spawnTask): Boolean;
    spawnNewCreep: any;
}
interface spawnTask {
    memory: any;
    CreatedBy: string;
    gameTime: number;
    type: string;
    body: string[];
    Destination: string;

}
