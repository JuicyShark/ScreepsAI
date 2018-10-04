interface ITask extends protoTask {
    settings: TaskSettings;
    proto: protoTask;
    creep: Creep;
    target: RoomObject | null;
    targetPos: RoomPosition;
    parent: ITask | null;
    manifest: ITask[];
    targetManifest: (RoomObject | null)[];
    targetPosManifest: RoomPosition[];
    eta: number | undefined;
    fork(newTask: ITask): ITask;
    isValidTask(): boolean
    isValidTarget(): boolean;
    isValid(): boolean;
    moveToTarget(range?: number): number;
    run(): number | void;
    work(): number;
    finish(): void;
}

interface RTask extends protoRoomTask {
    settings: RoomTaskSettings;
    proto: protoRoomTask;
    room: Room;
    parent: RTask | null;
    manifest: RTask[];
}


interface IGlobalCache {
    accessed: { [key: string]: number };
    expiration: { [key: string]: number };
    structures: { [key: string]: Structure[] };
    numbers: { [key: string]: number };
    lists: { [key: string]: any[] };
    costMatrixes: { [key: string]: CostMatrix };
    roomPositions: { [key: string]: RoomPosition | undefined };
    things: { [key: string]: undefined | HasID | HasID[] };
    // objects: { [key: string]: Object };
}

interface ICache {
    creepsByColony: { [colonyName: string]: Creep[] };
    targets: { [ref: string]: string[] };
    outpostFlags: Flag[];
    build(): void;
    refresh(): void;
}
declare var _cache: IGlobalCache;
