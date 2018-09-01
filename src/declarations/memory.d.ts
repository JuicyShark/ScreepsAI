
interface Memory {
    strategist?: any;
    CrypMind: {};
    colonies: { [name: string]: any };
	creeps: { [name: string]: CreepMemory; };
	flags: { [name: string]: FlagMemory; };
	rooms: { [name: string]: RoomMemory; };
	spawns: { [name: string]: SpawnMemory; };
	settings: {
		signature: string;
		log: LoggerMemory;
		enableVisuals: boolean;
	}
	profiler?: any;
	stats: any;
	constructionSites: { [id: string]: number };
	suspend?: number;
}

interface StatsMemory {
	cpu: {
		getUsed: number;
		limit: number;
		bucket: number;
		usage: {
				init: number;
				run: number;
				visuals: number;
		}
	}
	gcl: {
		progress: number;
		progressTotal: number;
		level: number;
	}
}

interface CreepMemory {
	role: string;
    task: protoTask | null;
    colony: string;
	data: {
		origin: string;
	};
	_trav: object
	debug?: boolean;
}

interface LoggerMemory {
	level: number;
	showSource: boolean;
	showTick: boolean;
}

interface FlagMemory {
	amount?: number;
	created?: number;
	persistent?: boolean;
	setPosition?: protoPos;
	rotation?: number;
	parent?: string;
	maxPathLength?: number;
	maxLinearRange?: number;
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
	tick: number;
}

interface SpawnMemory {
}
