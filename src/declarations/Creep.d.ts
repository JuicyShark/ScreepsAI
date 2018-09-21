interface Creep {
    task: ITask | null;
    hasValidTask: boolean;
    isIdle: boolean;
    run(): number | void;
    //travelTo(destination: HasPos | RoomPosition, ops?: TravelToOptions): number;
    nextDirection: number;
}
interface CreepMemory {
    room: string;
    working: boolean;
    task: protoTask | null;
    type: string;
    _trav: object;
    colony: string;
    home: string;
    destination: string;
    myContainer: string;
}
