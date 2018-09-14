declare class Colony {
    memory: ColonyMemory;
    name: string;
    ref: string;
    id: number;
    roomNames: string[];
    room: Room;
    outposts: Room[];									// Rooms for remote resource collection
    rooms: Room[];
    pos: RoomPosition;
    creeps: Creep[];// Creeps bound to the colony
    creepsByType: { [typeName: string]: Creep[] };// Creeps hashed by their role name
    build(roomName: string, outposts: string[]): void;
}

interface ColonyMemory {
    coreRoom: string;
}


interface outpost {

}
