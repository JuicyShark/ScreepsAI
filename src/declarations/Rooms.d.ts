type HasPos = { pos: RoomPosition }

//changed from interface to class
/*declare class RoomTask {
    name: string;
    roomOrder: string;
    priority: number;
    details: any;
    constructor(name: string, roomOrder: string, priority: number, details: Object | SpawnTask)


}*/
interface RoomCoord {
    x: number;
    y: number;
    xDir: string;
    yDir: string;
}

interface RoomPosition {
    get: any;
    print: string;
    room: Room | undefined;
    name: string;
    coordName: string;
    isEdge: boolean;
    //roomCoords: Coord;
    isPassible(ignoreCreeps?: boolean): boolean;
    isVisible: boolean;
    neighbors: RoomPosition[];
    availableNeighbors(ignoreCreeps?: boolean): RoomPosition[];
    findClosestByLimitedRange<T>(objects: T[] | RoomPosition[], rangeLimit: number,
        opts?: { filter: any | string; }): T | undefined;
}
interface Room {
    run(Colony: Colony): void;
    isIdle: boolean;
    decodeRoomLocation: any
    getRoomLocation: any;
    executeRoom: any;
    handleMyRoom: any;
    handleUnreservedRoom: any;
    handleOccupiedRoom: any;
    handleExternalHighwayRoom: any;
    handleExternalRoom: any;
    handleReservedRoom: any;
    handleAllyRoom: any;
    runMyType: any;
    checkandSpawn(colony: Colony): void
    memLog: any;
    print: string;
    my: boolean;
    owner: string | undefined
    reservedByMe: any;
    signedByMe: any;
    roomType: string;
    isOutpost: Boolean | null;


    // Cached structures
    tombstones: Tombstone[];
    creeps: Creep[];
    creepsByType: { [roleName: string]: Creep[] };
    drops: { [resourceType: string]: Resource[] };
    droppedEnergy: Resource[];
    droppedPower: Resource[];
    // Room structures
    _refreshStructureCache: any
    // Multiple structures
    spawns: StructureSpawn[];
    extensions: StructureExtension[];
    roads: StructureRoad[];
    walls: StructureWall[];
    constructedWalls: StructureWall[];
    ramparts: StructureRampart[];
    walkableRamparts: StructureRampart[];
    barriers: (StructureWall | StructureRampart)[];
    hostileStructures: Structure[];
    _hostileStructures: Structure[];
    //storageUnits: StorageUnit[];
    keeperLairs: StructureKeeperLair[];
    portals: StructurePortal[];
    links: StructureLink[];
    towers: StructureTower[];
    labs: StructureLab[];
    containers: StructureContainer[];
    powerBanks: StructurePowerBank[];
    // Single structures
    observer: StructureObserver | undefined;
    powerSpawn: StructurePowerSpawn | undefined;
    extractor: StructureExtractor | undefined;
    nuker: StructureNuker | undefined;
    repairables: Structure[];
    //rechargeables: rechargeObjectType[];
    sources: Source[];
    mineral: Mineral | undefined;
    constructionSites: ConstructionSite[];
    initStructures: any;
    structures: any;
    initContainers: any;
    //Extras
    flags: Flag[];
    _flags: Flag[];
    hostiles: Creep[] | null;
    _hostiles: Creep[] | null;
    invaders: Creep[];
    _invaders: Creep[];
    sourceKeepers: Creep[];
    _sourceKeepers: Creep[];
    playerHostiles: Creep[];
    _playerHostiles: Creep[];
    dangerousHostiles: Creep[];
    _dangerousHostiles: Creep[];
    dangerousPlayerHostiles: Creep[];
    _dangerousPlayerHostiles: Creep[];
    fleeDefaults: Creep[];
    _fleeDefaults: Creep[];
    _tempLog: any;
    //RoomTask
    RoomTask: RTask | null;
    _roomTask: RTask;


}
interface SavedRoomObject {
    c: string; 	// coordinate name
}

interface SavedSource extends SavedRoomObject {
    contnr: string | undefined;
    miner: boolean | undefined;
}

interface SavedController extends SavedRoomObject {
    level: number;
    owner: string | undefined;
    res: {
        username: string,
        ticksToEnd: number,
    } | undefined;
    SM: number | undefined;
    SMavail: number;
    SMcd: number | undefined;
    prog: number | undefined;
    progTot: number | undefined;
}

interface SavedMineral extends SavedRoomObject {
    mineralType: MineralConstant;
    density: number;
}

interface RoomMemory {
    avoid: number;
    tick: number;
    src?: SavedSource[];
    ctrl?: SavedController | undefined;
    mnrl: SavedMineral | undefined;
    SKlairs?: SavedRoomObject[];
    outposts: string[];
    importantStructs?: {
        // Positions of important structures relevant to sieges
        towers: string[];
        spawns: string[];
        storage: string | undefined;
        terminal: string | undefined;
        walls: string[];
        ramparts: string[];
    } | undefined;
    expiration?: number;
    prevPositions?: { [creepID: string]: protoPos };
    lastSeen: number;
    queue: any;
    timer: number;
    suspended: boolean;
    roomPos: any;
    log: Object[];
}
interface RoomObject {
    print: string;
    StructureController: any;
    ref: string;
    targetedBy: Creep[];
    serialize: any;
    hasMiner(): boolean;


}
