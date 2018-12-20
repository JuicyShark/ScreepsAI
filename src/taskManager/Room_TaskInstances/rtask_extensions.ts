import { RoomTask } from '../Room_Task';



export type spawnCreepTargetType = StructureSpawn;
export const TaskName = 'extensions';

export class RTaskextensions extends RoomTask {

    static taskName = 'extensions';


    constructor(Colony: Colony, TaskData: RoomTaskData, options = {} as RoomTaskOptions) {
        super(Colony, TaskName, TaskData);
    }

    isValidRoomTask(): boolean {
        var extensionsB = (this.data.data.builtextensions.length + this.data.data.wipExtensions.length);
        if (extensionsB == this.data.data.extensionCount) {
            return false;
        }

        if (Game.time == this.data.data.idleTill || Game.time > this.data.data.idleTill) {
            return false;
        }
        else if (Game.time <= this.data.data.idleTill) {
            return true
        }
        else return false
    }

    work(): number {
        var output = -5;
        var dataPack: RoomTaskData = this.data
        const daPck = dataPack.data
        const roomName = dataPack.roomName
        const visual = new RoomVisual(roomName);
        let room = Game.rooms[roomName]
        var extensionsB = (daPck.builtextensions.length + daPck.wipExtensions.length);
        var extensionReq = (daPck.extensionCount - extensionsB);


        if (extensionsB == daPck.extensionCount) {
            return output = 0;

        }
        else if (extensionsB < daPck.extensionCount) {
            var checker: RoomPosition[] = daPck.homeZonePath;
            var homeZone: RoomPosition[] = daPck.homeZone;




            for (let i = 0; i < extensionReq; i++) {
                if (extensionsB == daPck.extensionCount) {
                    output = 0;
                    break;
                } else {
                    var hZpos = homeZone[i]
                    if (!checker.length) {
                        output = 0;
                        break
                    } else if (checker.length != 0) {
                        checker.forEach(road => {
                            if (road.x === (hZpos.x - 1) && road.y === hZpos.y) {
                                room.createConstructionSite((hZpos.x - 1), hZpos.y, STRUCTURE_ROAD)
                                visual.circle(road.x, road.y, { fill: "green" })
                            }

                            if (road.y === (hZpos.y - 1) && road.x === hZpos.x) {
                                room.createConstructionSite(hZpos.x, (hZpos.y - 1), STRUCTURE_ROAD)
                                visual.circle(road.x, road.y, { fill: "green" })
                            } else if (road.y === (hZpos.y + 1) && road.x === hZpos.x) {
                                room.createConstructionSite(hZpos.x, (hZpos.y + 1), STRUCTURE_ROAD)
                                visual.circle(road.x, road.y, { fill: "green" })
                            }


                        })

                    }

                    room.createConstructionSite(hZpos.x, hZpos.y, STRUCTURE_EXTENSION)

                    //update

                    daPck.wipExtensions = room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });



                    //room.createConstructionSite()
                    visual.circle(hZpos.x, hZpos.y, { fill: "red" })

                }

            }

        }


    }

}


