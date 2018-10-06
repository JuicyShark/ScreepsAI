interface protoPos {
    x: number;
    y: number;
    roomName: string;
}
interface protoCreep {
    body: BodyPartConstant[];
    name: string;
    memory: any;
}

interface protoCreepOptions {
    assignment?: RoomObject;
    patternRepetitionLimit?: number;
}

interface protoRoomObject {
    ref: string;
    pos: protoPos;
}
interface protoTask {
    name: string;
    _creep: {
        name: string;
    };
    _target: {
        ref: string;
        _pos: protoPos;
    };
    _parent: protoTask | null;
    options: TaskOptions;
    data: TaskData;
    tick: number;
}
interface protoRoomTask {
    name: string;
    _room: Room;
    _parent: RTask | null;
    options: RoomTaskOptions;
    data: RoomTaskData;
    tick: number;
}
