Object.defineProperty(RoomPosition.prototype, 'print', {
	get() {
		return '<a href="#!/room/' + Game.shard.name + '/' + this.roomName + '">[' + this.roomName + ', ' + this.x + ', ' + this.y + ']</a>';
	},
	configurable: true,
});
Object.defineProperty(RoomPosition.prototype, 'roomCoords', {
	get         : function () {
		let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.roomName);
		let x = parseInt(parsed![1], 10);
		let y = parseInt(parsed![2], 10);
		if (this.roomName.includes('W')) x = -x;
		if (this.roomName.includes('N')) y = -y;
		return {x: x, y: y} as Coord;
	},
	configurable: true,
});

Object.defineProperty(RoomPosition.prototype, 'neighbors', {
	get         : function () {
		let adjPos: RoomPosition[] = [];
		for (let dx of [-1, 0, 1]) {
			for (let dy of [-1, 0, 1]) {
				if (!(dx == 0 && dy == 0)) {
					let x = this.x + dx;
					let y = this.y + dy;
					if (0 < x && x < 49 && 0 < y && y < 49) {
						adjPos.push(new RoomPosition(x, y, this.roomName));
					}
				}
			}
		}
		return adjPos;
	},
	configurable: true,
});