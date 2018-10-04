
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
    room: Room;
    creeps: Creep[];
    data: any;
    //yoagain
}
