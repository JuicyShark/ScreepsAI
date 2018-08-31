export class ColonyBrain {
    colony: Colony;
    directives: Directive[];

    constructor(colony: Colony){
        this.colony = colony;
        this.directives = [];
    }

    refresh(){
        this.directives = []
    }

    private registerLogisticsRequests(): void {
  // Register logistics requests for all dropped resources and tombstones
  for (let room of this.colony.rooms){
      // Pick up all dropped resources
      for(let resourceType in room.drops){
          for(let drop of room.drops[resourceType]){
              if(drop.amount > LogisticsNetwork.settings.droppedEnergyThreshold || drop.resourceType != RESOURCE_ENERGY){
                  this.colony.LogisticsNetwork.requestOutput(drop);
              }
          }
      }
  }
  // Place a logistics request directive for every tombstone with non-empty store that isn't on a container
  for (let tombstone of this.colony.tombstones) {
    if (_.sum(tombstone.store) > LogisticsNetwork.settings.droppedEnergyThreshold
        || _.sum(tombstone.store) > tombstone.store.energy) {
        if (this.colony.bunker && tombstone.pos.isEqualTo(this.colony.bunker.anchor)) continue;
        this.colony.logisticsNetwork.requestOutput(tombstone, {resourceType: 'all'});
    }
}

// Place reserving/harvesting directives if needed
if (Game.time % 250 == 2 * this.colony.id) {
    let numSources = _.sum(this.colony.roomNames, roomName => (Memory.rooms[roomName].src || []).length);
    let numRemotes = numSources - this.colony.room.sources.length;
    if (numRemotes < Colony.settings.remoteSourcesByLevel[this.colony.level]) {
        // Possible outposts are controller rooms not already reserved or owned
        log.debug(`Calculating colonies for ${this.colony.room.print}...`);
        log.debug(`Rooms in range 2: ${Cartographer.findRoomsInRange(this.colony.room.name, 2)}`);
        let possibleOutposts = _.filter(Cartographer.findRoomsInRange(this.colony.room.name, 2), roomName =>
            Cartographer.roomType(roomName) == ROOMTYPE_CONTROLLER
            && !_.any(Game.cache.outpostFlags,
                      function (flag) {
                          if (flag.memory.setPosition) {
                              return flag.memory.setPosition.roomName == roomName;
                          } else {
                              return flag.pos.roomName == roomName;
                          }
                      })
            && !Game.colonies[roomName]
            && !RoomBrain.roomOwnedBy(roomName)
            && !RoomBrain.roomReservedBy(roomName)
            && Game.map.isRoomAvailable(roomName));
        log.debug(`Possible outposts: ${possibleOutposts}`);
        let origin = this.colony.pos;
        let bestOutpost = minBy(possibleOutposts, function (roomName) {
            if (!Memory.rooms[roomName]) return false;
            let sourceCoords = Memory.rooms[roomName].src as SavedSource[] | undefined;
            if (!sourceCoords) return false;
            let sourcePositions = _.map(sourceCoords, src => derefCoords(src.c, roomName));
            let sourceDistances = _.map(sourcePositions, pos => Pathing.distance(origin, pos));
            if (_.any(sourceDistances, dist => dist == undefined
                                               || dist > Colony.settings.maxSourceDistance)) return false;
            return _.sum(sourceDistances) / sourceDistances.length;
        });
        if (bestOutpost) {
            let pos = Pathing.findPathablePosition(bestOutpost);
            log.info(`Colony ${this.colony.room.print} now remote mining from ${pos.print}`);
            DirectiveOutpost.createIfNotPresent(pos, 'room', {memory: {colony: this.colony.name}});
        }
    }
}
    }
}
