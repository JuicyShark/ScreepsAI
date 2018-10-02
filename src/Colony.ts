import { RoomBrain } from './ShowMaster/roomMaster';
import { setCreepTasks, runCreeps } from './ShowMaster/creepMaster';

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
  Age: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  roomNames: string[];
  room: Room;
  outposts: Room[];									// Rooms for remote resource collection
  rooms: Room[];
  pos: RoomPosition;
  creeps: Creep[];// Creeps bound to the colony
  creepsByType: { [typeName: string]: Creep[] };// Creeps hashed by their role name
  creepsByRoom: { [roomName: string]: Creep[] };// Creeps hashed by their current room

  // buildings
  storages: StructureStorage[] | undefined;

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
    this.creepsByRoom = _.groupBy(Game.creeps, creep => creep.room.name)
  }

  outerColonyWork() {
    //var outposts

    for (let i = 0; i < Object.keys(this.creepsByRoom).length; i++) {
      let roomName = Object.keys(this.creepsByRoom)[i]
      if (roomName != this.room.name) {
        var found = false;
        this.outposts.forEach(function (outpost: Room) {
          if (roomName == outpost.name) {
            found = true;
          }
        })
        this.rooms.forEach(function (daroom: Room) {
          if (roomName == daroom.name) {
            found = true;
          }
        })
        if (found == false) {
          Game.rooms[roomName].handleExternalRoom(this)
        }
        else {
        }

      }
    }
  }

  handleColonyHub(): void {
    if (!Memory.username) {
      Memory.username = this.room.controller.owner.username;
    }
    this.room.executeRoom()
    if (Object.keys(this.creepsByRoom).length > this.rooms.length) {
      this.outerColonyWork()
    }
    //Extra logic for Colonising multiple rooms
  }

  runOutposts(): void {
    this.outposts.forEach(function (room: Room, index: number, array: Room[]) {
      room.executeRoom()
    })
  }


  run(): void {
    setCreepTasks(this)
    runCreeps()
    this.handleColonyHub()

    if (this.outposts.length != 0) {
      this.runOutposts()
    }

  }

  refresh(): void {
    // Refresh rooms
    this.room = Game.rooms[this.room.name];
    this.outposts = _.compact(_.map(this.outposts, outpost => Game.rooms[outpost.name]));
    this.rooms = [this.room].concat(this.outposts);
    // refresh creeps
    this.creeps = Game.rooms[this.room.name].creeps || [];
    this.creepsByType = _.groupBy(this.creeps, creep => creep.memory.type);
    this.creepsByRoom = _.groupBy(this.creeps, creep => creep.memory.home)
    // Register the rest of the colony components; the order in which these are called is important!

    this.registerOperationalState();
  }
  private registerOperationalState(): void {
    this.Age = this.room.controller.level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    if (this.storages && this.room.spawns[0]) {
      // If the colony has storage and a spawn
      if (this.Age == 8) {
        //expand like crazy
      } else {

      }
    } else {
      //build up
    }
  }

}
