import { isStructure } from "declarations/typeGuards";

export class extesnions {

    public static testmeout(Colony: Colony, room: Room) {
        const roomName = room.name;
        const terrain = new Room.Terrain(roomName);
        const matrix = new PathFinder.CostMatrix;
        const visual = new RoomVisual(roomName);
        var homeZone: RoomPosition[] = [];
        var homeZonePath: RoomPosition[] = []
        var extensionCount = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
        var builtextensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION })

        // Fill CostMatrix with default terrain costs for future analysis:
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                const roomPos = new RoomPosition(x, y, room.name)
                const structs = room.lookForAt(LOOK_STRUCTURES, roomPos).filter(
                    (s) => s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_TOWER ||
                        s.structureType == STRUCTURE_SPAWN)

                const weight =
                    tile === TERRAIN_MASK_WALL ? 255 : // wall  => unwalkable
                        tile === TERRAIN_MASK_SWAMP ? 5 : // swamp => weight:  5
                            1; // plain => weight:  1
                matrix.set(x, y, weight);
                if (roomPos.getRangeTo(room.spawns[0]) <= 8) {
                    if ((x + y) % 2 === 0 && weight != 255) {
                        if (structs.length) {
                        } else {
                            homeZone.push(roomPos)
                        }
                    }
                    else if ((x + y) % 1 === 0 && weight != 255) {
                        if (structs.length) {
                        } else {
                            homeZonePath.push(roomPos)
                        }
                    }
                }

            }
        }


        homeZone.forEach(function (roomPos: RoomPosition, index: number) {
            if (!builtextensions.length || builtextensions.length < extensionCount) {
                //console.log("I NEED EXTENSIOONNNSSS")
                //roomPos.createConstructionSite(STRUCTURE_EXTENSION)
            }

            visual.circle(roomPos.x, roomPos.y, { fill: "red" })
        })
        homeZonePath.forEach(function (roomPos: RoomPosition, index: number) {


            visual.circle(roomPos.x, roomPos.y, { fill: "green" })
        })


    }
}
