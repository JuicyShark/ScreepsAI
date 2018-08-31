import { TargetCache } from "utils/caching";

// RoomObject prototypes
Object.defineProperty(RoomObject.prototype, 'ref', { // reference object; see globals.deref (which includes Creep)
	get         : function () {
		return this.id || this.name || '';
	},
	configurable: true,
});

Object.defineProperty(RoomObject.prototype, 'targetedBy', { // List of creep names with tasks targeting this object
	get         : function () {
         TargetCache.checkCache()
         return _.map(Game.TargetCache.targets[this.ref], name => Game.creeps[name]);
	},
	configurable: true,
});

RoomObject.prototype.serialize = function (): protoRoomObject {
	let pos: protoPos = {
		x       : this.pos.x,
		y       : this.pos.y,
		roomName: this.pos.roomName
	};
	return {
		pos: pos,
		ref: this.ref
	};
};