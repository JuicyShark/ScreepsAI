
interface TaskSettings {
    blind: any;
    timeout: any;
    oneShot: any;
    targetRange: number;
    workOffRoad: boolean;
}

interface TaskOptions {
    blind?: boolean;
    nextPos?: protoPos;
    moveOptions?: MoveToOpts;
    // moveOptions: TravelToOptions; // <- uncomment this line if you use Traveler
}

interface TaskData {
    quiet?: boolean;
    resourceType?: string;
    amount?: number;
    signature?: string;
    skipEnergy?: boolean;
}
