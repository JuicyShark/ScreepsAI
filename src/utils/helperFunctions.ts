// Universal reference properties
export function deref(ref: string): RoomObject | null { // dereference any object from identifier; see ref in RoomObjects
	return Game.getObjectById(ref) || Game.flags[ref] || Game.creeps[ref] || Game.spawns[ref] || null;
}

export function derefRoomPosition(protoPos: protoPos): RoomPosition {
	return new RoomPosition(protoPos.x, protoPos.y, protoPos.roomName);
}

// Type guard functions
export interface EnergyStructure extends Structure {
	energy: number;
	energyCapacity: number;
}

export interface StoreStructure extends Structure {
	store: StoreDefinition;
	storeCapacity: number;
}

export function isEnergyStructure(structure: Structure): structure is EnergyStructure {
	return (<EnergyStructure>structure).energy != undefined && (<EnergyStructure>structure).energyCapacity != undefined;
}

export function isStoreStructure(structure: Structure): structure is StoreStructure {
	return (<StoreStructure>structure).store != undefined;
}
export function getUsername(): string {
	for (let i in Game.rooms) {
		let room = Game.rooms[i];
		if (room.controller && room.controller.my) {
			return room.controller.owner.username;
		}
	}
	console.log('ERROR: Could not determine username. You can set this manually in src/settings/settings_user');
	return 'ERROR: Could not determine username.';
}
export function logHeapStats(): void {
	if (typeof Game.cpu.getHeapStatistics === 'function') {
		let heapStats = Game.cpu.getHeapStatistics();
		let heapPercent = Math.round(100 * (heapStats.total_heap_size + heapStats.externally_allocated_size)
									 / heapStats.heap_size_limit);
		let heapSize = Math.round((heapStats.total_heap_size) / 1048576);
		let externalHeapSize = Math.round((heapStats.externally_allocated_size) / 1048576);
		let heapLimit = Math.round(heapStats.heap_size_limit / 1048576);
		console.log(`Heap usage: ${heapSize} MB + ${externalHeapSize} MB of ${heapLimit} MB (${heapPercent}%).`);
	}
}

export function isIVM(): boolean {
	return typeof Game.cpu.getHeapStatistics === 'function';
}

export function getCacheExpiration(timeout: number, offset = 5): number {
	return Game.time + timeout + Math.round((Math.random() * offset * 2) - offset);
}