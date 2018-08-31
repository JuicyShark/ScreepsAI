import { roomBrain } from "prototypes/prototype.roomBrain";

function checkRoomString(roomName:string | Room): any {
    let room: Room;
    if(typeof roomName === 'string'){
        return Game.rooms[roomName]
        
    }else{
        return roomName;
    }
    
}


//exports below

export function roomTick(roomName:string | Room): any {
    let room = checkRoomString(roomName)

    if(!room.memory.timer || room.memory.timer % 60 === 0){
        //where memory Init was
        room.memory.timer = 60;
    }

    if(room.memory.timer % 15 == 0) {
        //where creep init was
    }

    --room.memory.timer
}

export function processAsMine(roomName: string | Room): any 
{
    if(0 == 2){
        roomTick(roomName)
    } else {
        return false
    }
    }
export function processAsGuest(roomName: string | Room):any 
{
    let room = checkRoomString(roomName)
}
export function isMine(roomName: string | Room): Boolean 
{
    let room = checkRoomString(roomName)
    if(room.controller === undefined)
    {
        return false
    } 
    return room.controller.my; 

}
export function alertLevel(roomName: string | Room): Number
{
    let room: Room;
    if(typeof roomName === 'string'){
        room = Game.rooms[roomName]
    }else{
        room = roomName;
    }
    if(room.find(FIND_HOSTILE_CREEPS) !== null){
        return 1
    }
    return 0
}