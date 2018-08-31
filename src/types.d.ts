// example declaration file - remove these and add your own custom typings
declare class Tasks {
	static chain(tasks: ITask[], setNextPos?: boolean): ITask | null
	static attack(target: attackTargetType, options?: TaskOptions): ITask;
	static build(target: buildTargetType, options?: TaskOptions): ITask;
	static claim(target: claimTargetType, options?: TaskOptions): ITask;
	static dismantle(target: dismantleTargetType, options?: TaskOptions): ITask;
	static drop(target: dropTargetType, resourceType?: ResourceConstant, amount?: number | undefined,
				options?: TaskOptions): ITask;
	static fortify(target: fortifyTargetType, options?: TaskOptions): ITask;
	static getBoosted(target: getBoostedTargetType, boostType: _ResourceConstantSansEnergy,
					  amount?: number | undefined, options?: TaskOptions): ITask;
	static getRenewed(target: getRenewedTargetType, options?: TaskOptions): ITask;
	static goTo(target: goToTargetType, options?: TaskOptions): ITask;
	static goToRoom(target: goToRoomTargetType, options?: TaskOptions): ITask;
	static harvest(target: harvestTargetType, options?: TaskOptions): ITask;
	static heal(target: healTargetType, options?: TaskOptions): ITask;
	static meleeAttack(target: meleeAttackTargetType, options?: TaskOptions): ITask;
	static pickup(target: pickupTargetType, options?: TaskOptions): ITask;
	static rangedAttack(target: rangedAttackTargetType, options?: TaskOptions): ITask;
	static repair(target: repairTargetType, options?: TaskOptions): ITask;
	static reserve(target: reserveTargetType, options?: TaskOptions): ITask;
	static signController(target: signControllerTargetType, signature: string,
						  options?: TaskOptions): ITask;
	static transfer(target: transferTargetType, resourceType?: ResourceConstant, amount?: number | undefined,
					options?: TaskOptions): ITask;
	static transferAll(target: transferAllTargetType, skipEnergy?: boolean, options?: TaskOptions): ITask;
	static upgrade(target: upgradeTargetType, options?: TaskOptions): ITask;
	static withdraw(target: withdrawTargetType, resourceType?: ResourceConstant, amount?: number | undefined,
					options?: TaskOptions): ITask;
	static withdrawAll(target: withdrawAllTargetType, options?: TaskOptions): ITask;
}
type attackTargetType = Creep | Structure;
type buildTargetType = ConstructionSite;
type claimTargetType = StructureController;
type dismantleTargetType = Structure;
type dropTargetType = { pos: RoomPosition } | RoomPosition;
type fortifyTargetType = StructureWall | StructureRampart;
type getBoostedTargetType = StructureLab;
type getRenewedTargetType = StructureSpawn;
type goToTargetType = { pos: RoomPosition } | RoomPosition;
type goToRoomTargetType = string;
type harvestTargetType = Source;
type healTargetType = Creep;
type meleeAttackTargetType = Creep | Structure;
type pickupTargetType = Resource;
type rangedAttackTargetType = Creep | Structure;
type repairTargetType = Structure;
type reserveTargetType = StructureController;
type signControllerTargetType = StructureController;
type transferTargetType = EnergyStructure
	| StoreStructure
	| StructureLab
	| StructureNuker
	| StructurePowerSpawn
	| Creep;
type transferAllTargetType = StructureStorage | StructureTerminal | StructureContainer;
type upgradeTargetType = StructureController;
type withdrawTargetType =
	EnergyStructure
	| StoreStructure
	| StructureLab
	| StructureNuker
	| StructurePowerSpawn
	| Tombstone;
type withdrawAllTargetType = StructureStorage | StructureTerminal | StructureContainer | Tombstone;



// memory extension samples
interface EnergyStructure extends Structure {
	energy: number;
	energyCapacity: number;
}

interface StoreStructure extends Structure {
	store: StoreDefinition;
	storeCapacity: number;
}


interface Game {
  TargetCache:{
    tick: number;
    targets: {[ref: string]: string[]};
    build(): void;
  }
}
 interface GameMemory {
  uuid: number;
  log: any;
  memVersion: any;
  creeps:
  {
    [name: string]: any
  };
  flags:
  {
    [name: string]: any
  };
  rooms:
  {
    [name: string]: any
  };
  spawns:
  {
    [name: string]: any
  };
}

interface TaskSettings {
	targetRange: number;
  workOffRoad: boolean;
  oneShot: boolean;
}

interface TaskOptions {
  blind?: boolean;
  nextPos?: protoPos;
	moveOptions: TravelToOptions; 
}

interface TaskData {
	quiet?: boolean;
	resourceType?: string;
	amount?: number;
	signature?: string;
	skipEnergy?: boolean;
}

//protoTask is basic task
interface protoTask{
  name: string;
  _creep: {
    name: string;
  };
  _target: {
    ref: string;
    _pos: protoPos;
  }
  _parent: protoTask | null;
  options: TaskOptions;
  data: TaskData;
  tick: number;
}
interface ITask extends protoTask{
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

interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
  task: protoTask | null;
  type: string;
  _trav: object
}

interface Creep {
  task: ITask | null;
  hasValidTask: boolean;
  isIdle: boolean;
  run(): number | void;
  travelTo(destination: HasPos|RoomPosition, ops?: TravelToOptions): number;
  nextDirection: number;
}

interface protoPos {
  x: number;
  y: number;
  roomName: string;
}
interface Room {
  print:string;
  owner: string | undefined;
  // Cached structures
	tombstones: Tombstone[];
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
}
interface SavedRoomObject {
	c: string; 	// coordinate name
}

interface SavedSource extends SavedRoomObject {
	contnr: string | undefined;
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
}
interface RoomObject {
  print: string;
  StructureController: any;
  ref: string;
	targetedBy: Creep[];
   
}

interface RoomPosition {
  print: string;
  room: Room | undefined;
  name: string;
  coordName: string;
  isEdge: boolean;
  roomCoords: Coord;
  isPassible(ignoreCreeps?: boolean): boolean;
  isVisible: Boolean;
  neighbors: RoomPosition[];
  availableNeighbors(ignoreCreeps?: boolean): RoomPosition[];
  findClosestByLimitedRange<T>(objects: T[] | RoomPosition[], rangeLimit: number,
    opts?: { filter: any | string; }): T | undefined;
}
interface Tower {

}
interface StructureController {
	reservedByMe: boolean;
	signedByMe: boolean;
	signedByScreeps: boolean;

	needsReserving(reserveBuffer: number): boolean;
}
// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

// Traveler Declairations
interface PathfinderReturn {
  path: RoomPosition[];
  ops: number;
  cost: number;
  incomplete: boolean;
}

interface TravelToReturnData {
  nextPos?: RoomPosition;
  pathfinderReturn?: PathfinderReturn;
  state?: TravelState;
  path?: string;
}

interface TravelToOptions {
  ignoreRoads?: boolean;
  ignoreCreeps?: boolean;
  ignoreStructures?: boolean;
  preferHighway?: boolean;
  highwayBias?: number;
  allowHostile?: boolean;
  allowSK?: boolean;
  range?: number;
  obstacles?: {pos: RoomPosition}[];
  roomCallback?: (roomName: string, matrix: CostMatrix) => CostMatrix | boolean;
  routeCallback?: (roomName: string) => number;
  returnData?: TravelToReturnData;
  restrictDistance?: number;
  useFindRoute?: boolean;
  maxOps?: number;
  movingTarget?: boolean;
  freshMatrix?: boolean;
  offRoad?: boolean;
  stuckValue?: number;
  maxRooms?: number;
  repath?: number;
  route?: {[roomName: string]: boolean};
  ensurePath?: boolean;
}

interface TravelData {
  state: any[];
  path: string;
}

interface TravelState {
  stuckCount: number;
  lastCoord: Coord;
  destination: RoomPosition;
  cpu: number;
}



type Coord = {x: number, y: number};
type HasPos = {pos: RoomPosition}
