declare const require: (module: string) => any;
declare var global: any;

declare namespace NodeJS {
	interface Global {

		_cache: IGlobalCache;

		__VERSION__: string;

		print(...args: any[]): void;

		deref(ref: string): RoomObject | null;

		derefRoomPosition(protoPos: protoPos): RoomPosition;
	}
}

// declare module 'screeps-profiler'; // I stopped using the typings for this because it was fucking up the Game typings

declare module 'columnify';

// If TS2451 gets thrown, change "declare let Game: Game;" to "declare var Game: Game;"
// in typed-screeps index.d.ts file. (See issue #61 until the package is updated)
interface Game {
	
}

interface IGlobalCache {
	accessed: { [key: string]: number };
	expiration: { [key: string]: number };
	structures: { [key: string]: Structure[] };
	numbers: { [key: string]: number };
	lists: { [key: string]: any[] };
	costMatrices: { [key: string]: CostMatrix };
	roomPositions: { [key: string]: RoomPosition | undefined };
	things: { [key: string]: undefined | HasID | HasID[] };
	// objects: { [key: string]: Object };
}

interface ICache {
	targets: { [ref: string]: string[] };
	outpostFlags: Flag[];
	build(): void;
	refresh(): void;
}

interface IStrategist {
	refresh(): void;
	init(): void;
	run(): void;
}


declare var _cache: IGlobalCache;

declare function print(...args: any[]): void;

interface Coord {
	x: number;
	y: number;
}

interface RoomCoord {
	x: number;
	y: number;
	xDir: string;
	yDir: string;
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

interface protoPos {
	x: number;
	y: number;
	roomName: string;
}

interface HasPos {
	pos: RoomPosition
}

interface HasRef {
	ref: string
}

interface HasID {
	id: string
}