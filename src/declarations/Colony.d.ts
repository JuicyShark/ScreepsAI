declare class Colony {
    memory: ColonyMemory;
    name: string;
    ref: string;
    id: number;
    Age: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    roomNames: string[];
    room: Room;
    outposts: Room[];									// Rooms for remote resource collection
    rooms: Room[];
    roomTasks: RoomTask[] | any;
    storages: StructureStorage[] | undefined;
    pos: RoomPosition;
    creeps: Creep[];// Creeps bound to the colony
    creepsByType: { [typeName: string]: Creep[] };// Creeps hashed by their role name
    creepsByRoom: { [roomName: string]: Creep[] };
    build(roomName: string, outposts: string[]): void;
    run(): void
    roomTaskDupe(roomTask: RoomTask): void;
    filterTask(roomOrder: string): any;
}

interface ColonyMemory {
    coreRoom: string;
}


interface outpost {

}
