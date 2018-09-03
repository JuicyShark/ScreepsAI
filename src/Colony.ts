//import
export function getAllColonies() {

}

interface ColonyMemory {

}

const defaultColonyMemory: ColonyMemory = {

}
export function createBaseColony(): void {
  for (var i in Game.rooms) {
    var room = Game.rooms[i];
    global.BaseColony = new Colony(1, room.name, room.memory.outposts);
    break;
  }
}

export class Colony {
  memory: ColonyMemory;
  name: string;
  ref: string;
  id: number;
  roomNames: string[];
  room: Room;
  outposts: Room[];									// Rooms for remote resource collection
  rooms: Room[];
  pos: RoomPosition;
  creeps: Creep[];// Creeps bound to the colony
  creepsByRole: { [roleName: string]: Creep[] };// Creeps hashed by their role name

  constructor(id: number, roomName: string, outposts: string[]) {
    this.id = id;
    this.name = roomName;
    this.ref = roomName;

    this.build(roomName, outposts)
  }

  build(roomName: string, outposts: string[]): void {
    this.roomNames = [roomName].concat(outposts);
    this.room = Game.rooms[roomName];
    this.outposts = _.compact(_.map(outposts, outpost => Game.rooms[outpost]))
    this.rooms = [this.room].concat(this.outposts)
    this.creeps = Game.rooms[roomName].creeps || [];
    this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role);

  }
}
