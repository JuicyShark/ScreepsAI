declare module 'creep-tasks' {
	export default Tasks;
}

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

interface EnergyStructure extends Structure {
	energy: number;
	energyCapacity: number;
}

interface StoreStructure extends Structure {
	store: StoreDefinition;
	storeCapacity: number;
}
