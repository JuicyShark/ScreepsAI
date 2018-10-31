import { Room_Tasks } from '../TaskManager/Room_Tasks'
export class Outposts {
    static idleTask(Colony: Colony) {
        let data = {
            _colony: Colony.id,
            roomName: Colony.room.name,
            data: {
                idleTill: (Game.time + 60)
            }

        }

        Colony.room.RoomTask = Room_Tasks.roomIdle(Colony, data as RoomTaskData);

    }

    static *OutpostGuide(Colony: Colony, room: Room) {
        var outp: outp;
        outp = { boolean: true, info: "Starting" }
        var trigger = yield outp;
        outp = { boolean: true, info: trigger }
        const dataPacket: GuideDataPacket = yield outp;
        outp = { boolean: true, info: "Ready" }
        yield outp
        //console.log(creepTypes[creepType].string)
        trigger = dataPacket ? true : false;

        if (trigger == true) {

            if (dataPacket.cr == 0) {
                outp = { boolean: true, info: { type: "Idle" } }
            }
        } else {
            outp = { boolean: true, info: { type: "Idle" } }
        }

        yield outp; // Do it
    }


    static newRoomTask(Colony: Colony, room: Room): void {

        var creepsNum = room.creeps ? room.creeps.length : 0;

        var selected: GuideDataPacket = {
            cr: creepsNum,

        }

        const Sb = this.OutpostGuide(Colony, room) //declaring should start it up
        var trigger = false;

        if (room.RoomTask == null) {
            trigger = true;
        }
        Sb.next()

        Sb.next(trigger) //Triggering -


        Sb.next(selected) //GuideDataPacket - Without this it wont trigger internally. - returns value {"Ready"}
        let temp001 = Sb.next().value as outp; //this call creates a value {isSpawning} Still being worked on.
        switch (temp001.info.type) {
            case undefined:
                console.log("Having an issue Spawning in Colony_Hub")
                break;
            case "Idle":
                temp001.boolean ? this.idleTask(Colony) : null
                break;
            default:
                temp001.boolean ? this.idleTask(Colony) : null
                break;


        }

    }

}
