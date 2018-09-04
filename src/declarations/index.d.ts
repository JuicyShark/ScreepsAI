declare var global: any;

declare namespace NodeJS {
	interface Global {

		_cache: IGlobalCache;

		__VERSION__: string;
		BaseColony: Colony;
		print(...args: any[]): void;

		deref(ref: string): RoomObject | null;

		derefRoomPosition(protoPos: protoPos): RoomPosition;
	}
}
interface HasRef {
	ref: string
}

interface HasID {
	id: string
}
interface PathfinderReturn {
	path: RoomPosition[];
	ops: number;
	cost: number;
	incomplete: boolean;
}
