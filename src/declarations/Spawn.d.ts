interface StructureSpawn {
    addToQue(spawnTask: spawnTask): Boolean;
    spawnNewCreep: any;
}
interface spawnTask {
    CreatedBy: string;
    gameTime: number;
    type: string;
    body: string[];
    Destination: string;

}
