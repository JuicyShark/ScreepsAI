import BaseProcess from './BaseProcess'
import C from '/include/constants'
import map from 'lodash-es/map'
import each from 'lodash-es/each'
import invoke from 'lodash-es/invoke'
import filter from 'lodash-es/filter'
import layouts from './layoutsys/static'
import {
    distanceTransform,
    blockablePixelsForRoom
} from '/lib/DistanceTransform'

export default class Layout extends BaseProcess {
    constructor(context) {
        super(context)
        this.context = context
        this.kernel = context.queryPosisInterface('baseKernel')
        this.sleep = context.queryPosisInterface('sleep')
        this.int = context.queryPosisInterface('interrupt')
        this.segments = context.queryPosisInterface('segments')
        //for the matrix
        this.structureMatrixCache = {}
        this.structureMatrixTick = {}
    }

    get log() {
        return this.context.log
    }

    get memory() {
        return this.context.memory
    }

    get children() {
        this.memory.children = this.memory.children || {}
        return this.memory.children
    }

    get roomName() {
        return this.memory.room
    }

    get room() {
        return Game.rooms[this.roomName]
    }

    init() {

    }

    run() {
        var buildQue = []
        let visionRooms = Game.rooms;
        for (let iterroom in visionRooms) {

            const room = visionRooms[iterroom]
            //console.log(room.name)
            //room.memory.dirtRoads = false;
            if ((room.controller === undefined || null) || room.controller.my == false) {
                //console.log("Not this room " , room.name)
                continue
            } else if (room.controller.my) {
                var level = room.controller.level;
                /*   if (this.segments.load(C.SEGMENTS.LAYOUT) === false) {
                        this.segments.activate(C.SEGMENTS.LAYOUT)
                        this.int.clearAllInterrupts()
                        this.int.wait(C.INT_TYPE.SEGMENT, C.INT_STAGE.START, C.SEGMENTS.LAYOUT)
                    } else {
                        this.int.setInterrupt(C.INT_TYPE.VISION, C.INT_STAGE.START)
                        this.sleep.sleep(10)
                    }*/

                console.log("Running Layout!", level)

                switch (level) {
                    case 1:
                        if(this.dirtRoads(room, buildQue) == true) {
                        } else {
                            console.log(this.dirtRoads(room, buildQue))
                        }
                        break;
                    case 2:
                        if(!(room.memory.dirtRoadOrder)) {
                            this.dirtRoads(room, buildQue)
                        }
                        //this.tier1(level, room, buildQue)
                        break;
                    case 3:
                        //this.tier1(level, room, buildQue)
                        break;
                    case 4:

                        break;
                    case 5:
                        break;
                    case 6:

                        break;
                    case 7:

                        break;
                    case 8:
                        break;
                }




                //end of room loop
            }
        }
    }




    /**
     * calls upon the all mighty city planner to carve out sections of the earth for devine travel
     * It creates roads. Pretty Simple
     * @param room - takes the room Object
     * @param buildQue - its a shit thing tbh
     * @return Boolean
     */
    dirtRoads(room, buildQue) {
        switch (room.memory.dirtRoadOrder) {
            case undefined:
                var bs = room.spawns[0];
                var destin = room.find(FIND_SOURCES)
                destin.push(room.controller)
                //let planner = this.roadInfo()
                for (let i = 0; i < destin.length; i++) {
                    let pathplan;
                    if(destin == C.STRUCTURE_CONTROLLER){
                        pathplan = bs.pos.findPathTo(destin[i], {
                            range: 3
                        })
                    } else {
                        pathplan = bs.pos.findPathTo(destin[i], {
                            range: 1
                        })
                    }
        
                    for (let q = 0; q < pathplan.length; q++) {
                        let datafuckeryroad = {
                            building: STRUCTURE_ROAD,
                            pos: {
                                x: pathplan[q].x,
                                y: pathplan[q].y
                            }
                        }
                        buildQue.push(datafuckeryroad);
                    }
                }
                if(buildQue.length > 0){
                    //console.log("New BuildQue!")
                    this.buildNow(room, buildQue)
                    room.memory.dirtRoadOrder = true
                    return true;
                } else {
                    return false;
                }

            case true:
                //console.log("True! Are roads placed?")
                return true;
            default:
                //console.log("Default")
                return false;
        }
    

}

tier1(level, room, buildQue) {
    let localorders = [];
    let wanted = [C.STRUCTURE_TOWER, C.STRUCTURE_EXTENSION, C.STRUCTURE_STORAGE, C.STRUCTURE_SPAWN, C.STRUCTURE_TERMINAL, C.STRUCTURE_CONTAINER, C.STRUCTURE_ROAD]
    let want = _.mapValues(_.pick(C.CONTROLLER_STRUCTURES, wanted), level)
    let allSites = room.find(C.FIND_MY_CONSTRUCTION_SITES)
    let sites = _.groupBy(allSites, 'structureType')
    let have = _.mapValues(room.structures, 'length')
    want[C.STRUCTURE_CONTAINER] = Math.min(level, C.CONTROLLER_STRUCTURES[C.STRUCTURE_CONTAINER][level])
    let src = room.spawns[0] || undefined
    for (let type in want) {
        let amount = want[type] - ((have[type] || 0) + (sites[type] || []).length)
        //console.log(type, want[type], have[type] || 0, (sites[type] || []).length)
        if (amount <= 0) continue
        //console.log(`Want ${amount} of ${type}`)

        if (src.pos) {
            if (src instanceof StructureSpawn) {
                // Make a array to store the config deconstructed
                var blueprintXy = []
                let maxYlength = Object.entries(layouts.default.layout).length;
                //Loop through each line in the layout object for the design
                for (let i = 0; i <= maxYlength; i++) {
                    let linedata = layouts.default.layout[i];
                    if (linedata == undefined | null) {
                        //backout if its not there
                        break;
                    }
                    let outcome = linedata.split("")
                    let datafuckery = {
                        orderY: outcome,
                        pos: {
                            x: 0,
                            y: i
                        }
                    }
                    blueprintXy.push(datafuckery)
                }

                //By now I have an array of arrays. The first being omplete with arrays of the lines of buildings. Not decoded
                let rowBluePrint = Object.values(blueprintXy);
                if (rowBluePrint.length != null || undefined) {

                    for (let e = 0; e < maxYlength; e++) {
                        l
                        let thline = rowBluePrint[e]
                        let thepos = thline.pos
                        let theline = thline.orderY

                        //Go through each letter
                        theline.forEach((letter, theX) => {

                            let selection;
                            //dont forget to take a break... Litteratlly

                            switch (letter) {
                                case " ":
                                    break
                                case "c":
                                    selection = C.STRUCTURE_CONTAINER
                                    break;
                                case "r":
                                    selection = C.STRUCTURE_ROAD
                                    break;
                                case "e":
                                    selection = C.STRUCTURE_EXTENSION
                                    break;
                                case "t":
                                    selection = C.STRUCTURE_TOWER
                                    break;
                                case "T":
                                    selection = C.STRUCTURE_TERMINAL
                                    break;
                                case "S":
                                    selection = C.STRUCTURE_SPAWN
                                    break;
                                case "s":
                                    selection = C.STRUCTURE_STORAGE
                                    break;
                                default:
                                    break;
                            }
                            //nono if it no no
                            if (!selection) {
                                return
                            }
                            let datafuckery2 = {
                                building: selection,
                                pos: {
                                    x: theX,
                                    y: thepos.y
                                }
                            }
                            localorders.push(datafuckery2);
                        })
                    }
                }
                let spawn = localorders.findIndex(item => item.building === C.STRUCTURE_SPAWN);
                let blueprintspawnpos = localorders[spawn].pos

                function diff(a, b) {
                    return Math.abs(a - b);
                }

                let difX = diff(blueprintspawnpos.x, src.pos.x)
                let difY = diff(blueprintspawnpos.y, src.pos.y)

                localorders.forEach(function (order) {

                    let lastx = order.pos.x += difX;
                    let lasty = order.pos.y += difY;
                    let selection = order.building;
                    let datafuckery3 = {
                        building: selection,
                        pos: {
                            x: lastx,
                            y: lasty
                        }
                    }

                    //ORDER UP PLS
                    buildQue.push(datafuckery3)
                }, room)
            } else {
                return
            }
        }
        return
    }



}

buildNow(room, buildQue) {
    buildQue.forEach((order) => {
        this.buildTime(room, order.building, order.pos.x, order.pos.y)
    },room)
}

/**
 * calls upon the all mighty city planner to carve out sections of the earth for devine travel
 * It creates roads. Pretty Simple
 * @param room - it needs an actual room refference here
 * @param strucutre - What kind of structure you want? fed directly to the creatConstructionsite call
 * @param x - its the X positon
 * @param y - its the Y postion
 * @returns NOTHING! Just does some shit with the room and builds crap, console logs result
 */
buildTime(room, structure, x, y) {
    //ORDER UP!
    let freespot = room.lookForAt(LOOK_STRUCTURES, x, y);
    if(freespot == undefined){
        freespot = []
    } else if (freespot.length == 0) {


        switch (room.createConstructionSite(x, y, structure)) {
            case 0:
                console.log("Creating ", structure, " at (x,y) : ", x, " ", y)
                break;
            case -1:
                console.log("Not Owner")
                break;
            case -7:
                console.log("Bad Location!")
                return -7;
            case -8:
                console.log("Construction Site Cap!")
                break;
            case -10:
                console.log("Bad Location for ", structure, " ", x, " ", y)
                break;
            case -14:
                break;
        }
    }

}


}