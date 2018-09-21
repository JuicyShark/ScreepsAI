//import
export function getAllColonies() {

}


export function checkColonys(): void {

  let myRooms = Object.values(Game.rooms);
  const gameColony = Game.colonies;
  for (var i = 0; i < myRooms.length; i++) {
    var room = Game.rooms[myRooms[i].name];
    var NextColonyID: number = Game.colonies.length + 1
    //first Colony Setup. AKA First Room?
    if (Game.colonies.length == 0) {
      //What do with first Colony
      var BaseColony = new Colony(NextColonyID, room.name, room.memory.outposts);
      gameColony.push(BaseColony)
      if (Memory.Colonies.length == 0) {
        Memory.Colonies.push(
          {
            ID: NextColonyID,
            roomName: room.name
          })
      }
      break;
    }
    else if (NextColonyID == 2 && Game.colonies.length == 1) {
      if (room.isOutpost == true) {
        gameColony[0].outposts.push(room)
      }
      //Check if its an outpost.
    }
  }
  // highway, spawner, outpost, basic
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
  creepsByType: { [typeName: string]: Creep[] };// Creeps hashed by their role name


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
    this.creepsByType = _.groupBy(this.creeps, creep => creep.memory.type);
  }
}
