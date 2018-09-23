
StructureTower.prototype.run = function (): void {
    let room: Room = this.room;

    var repair: Structure[] = room.structures
    var hostiles = room.hostiles;

    if (hostiles != null || hostiles.length > 0) {
        this.attack(hostiles[0]);
    }
    //if there are no hostiles...
    if (hostiles.length === 0) {
        //....first heal any damaged creeps
        for (let name in Game.creeps) {
            // get the creep object
            var creep = Game.creeps[name];
            if (creep.hits < creep.hitsMax) {
                this.heal(creep)
            }
        }
        if (this.energy > (this.energyCapacity / 2)) {

            //Find the closest damaged Structure
            var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s: Structure) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL });
            if (closestDamagedStructure) {
                this.repair(closestDamagedStructure);
            }
        }
    }

};
