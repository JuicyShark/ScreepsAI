import { GameCache } from "utils/caching/gameCache";

// RoomObject prototypes
Object.defineProperty(RoomObject.prototype, 'ref', { // reference object; see globals.deref (which includes Creep)
  get: function () {
    return this.id || this.name || '';
  },
  configurable: true,
});

Object.defineProperty(RoomObject.prototype, 'targetedBy', { // List of creep names with tasks targeting this object
  get: function () {
    GameCache.checkCache()
    return _.map(Game.TargetCache.targets[this.ref], name => Game.creeps[name]);
  },
  configurable: true,
});
Source.prototype.hasContainer = function () {
  if (this.pos.findClosestByLimitedRange(this.room.containers, 2)) {
    return true;
  }
  else {
    return false;
  }
};
Source.prototype.hasMiner = function () {
  var anyMiners: Creep[] | undefined = this.pos.findClosestByLimitedRange(this.room.creepsByType.Miner)
  if (anyMiners != null && anyMiners.length >= 1) {
    return true;
  }
  else {
    let found: boolean = false
    this.targetedBy.forEach(function (creep: Creep) {
      if (creep.memory.type == "Miner") {
        found = true
      }
    })

    if (found) {
      return true
    } else {
      return false
    }

  }
}
RoomObject.prototype.serialize = function (): protoRoomObject {
  let pos: protoPos = {
    x: this.pos.x,
    y: this.pos.y,
    roomName: this.pos.roomName
  };
  return {
    pos: pos,
    ref: this.ref
  };
};
