
interface TaskSettings {
    blind: any;
    timeout: any;
    oneShot: any;
    targetRange: number;
    workOffRoad: boolean;
}
interface RoomTaskSettings {
    timeout: any;
}

interface TaskOptions {
    blind?: boolean;
    nextPos?: protoPos;
    moveOptions?: MoveToOpts;
    // moveOptions: TravelToOptions; // <- uncomment this line if you use Traveler
}
interface RoomTaskOptions {
    creepLength: number;
    creepTarget: number;
    //yo
}

interface TaskData {
    quiet?: boolean;
    resourceType?: string;
    amount?: number;
    signature?: string;
    skipEnergy?: boolean;
}
interface RoomTaskData {
    _colony: Colony;
    roomName: string;
    spawns: StructureSpawn[] | null;
    creeps: {
        creepsByType: { [typeName: string]: Creep[] };
    };
    data: SpawnTask[] | any;
    //yoagain
}
interface SpawnTaskData extends SpawnTask {



}
