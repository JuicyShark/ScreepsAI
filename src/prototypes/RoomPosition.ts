RoomPosition.prototype.findClosestByLimitedRange = function <T>(objects: T[] | RoomPosition[], rangeLimit: number,
    opts?: { filter: any | string; }): T | undefined {
    let objectsInRange = this.findInRange(objects, rangeLimit, opts);
    return this.findClosestByRange(objectsInRange, opts);
};

RoomPosition.prototype.isPassible = function (ignoreCreeps = false): boolean {
    // Is terrain passable?
    //  GAME.MAP.getTerrainAt IS TURNING INTO   Game.map.getRoomTerrain
    if (Game.map.getRoomTerrain(this.roomName).get(this.x, this.y) == 1) return false;
    if (this.isVisible) {
        // Are there creeps?
        if (ignoreCreeps == false && this.lookFor(LOOK_CREEPS).length > 0) return false;
        // Are there structures?
        let impassibleStructures = _.filter(this.lookFor(LOOK_STRUCTURES), function (this: any, s: Structure) {
            return this.structureType != STRUCTURE_ROAD &&
                s.structureType != STRUCTURE_CONTAINER &&
                !(s.structureType == STRUCTURE_RAMPART && ((<StructureRampart>s).my ||
                    (<StructureRampart>s).isPublic));
        });
        return impassibleStructures.length == 0;
    }
    return true;
};

Object.defineProperty(RoomPosition.prototype, 'isEdge', { // if the position is at the edge of a room
    get: function () {
        return this.x == 0 || this.x == 49 || this.y == 0 || this.y == 49;
    },
});

RoomPosition.prototype.availableNeighbors = function (ignoreCreeps = false): RoomPosition[] {
    return _.filter(this.neighbors, pos => pos.isPassible(ignoreCreeps));
};
