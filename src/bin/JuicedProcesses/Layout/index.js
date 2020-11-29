import BaseProcess from '../BaseProcess'
import C from '/include/constants'
import map from 'lodash-es/map'
import each from 'lodash-es/each'
import invoke from 'lodash-es/invoke'
import filter from 'lodash-es/filter'
import layouts from './static'
import { distanceTransform, blockablePixelsForRoom } from '/lib/DistanceTransform'

export default class Layout extends BaseProcess {
    constructor (context) {
        super(context)
        this.context = context
        this.kernel = context.queryPosisInterface('baseKernel')
        this.sleep = context.queryPosisInterface('sleep')
        this.mm = context.queryPosisInterface('segments')
        //for the matrix
        this.structureMatrixCache = {}
        this.structureMatrixTick = {}
    }
    
    get memory () {
        return this.context.memory
    }

    get buildList () {
        if(!(this.memory.layoutsys.rooms)) {
            this.memory.layoutsys.rooms = {}
        }
        let returnob = this.memory.layoutsys.rooms[this.room]
        if (!(returnob.buildList)) {
            returnob.buildList = [];
        }
        return returnob.buildList;
    }
    
    get roomName () {
        return this.memory.room
    }
    
    get room () {
        return Game.rooms[this.roomName]
    }

    get debuginf () {
        return "debugging Okay"
    }

    init() {
        if (!(this.memory.layoutsys)) {
            this.memory.layoutsys = {}
        }
    }

    run () {
        
        this.sleep.sleep(10)
        const room = this.room
        const { controller: { level } } = this.room
        //
        this.sleep.sleep(10)
        switch (room.controller.level) {
            case 1:
                //maybs put init
                break;
            case 2:
                this.dirtRoads(room)
                this.tier1(level, room)
                break;
            case 3:
                this.tier1(level, room)
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
        
    }

        /**
     * calls upon the all mighty city planner to carve out sections of the earth for devine travel
     * It creates roads. Pretty Simple
     * @param room!
     * @returns {CostMatrix}
     */
    dirtRoads(room) {
        if (!(room.memory.dirtRoads)){
            room.memory.dirtRoads = true;
        }
        else {return}
        const bs = this.room.spawns[0];
        var destin = this.room.find(FIND_SOURCES)
        destin.push(this.room.controller)
        //let planner = this.roadInfo()
            for (let i=0; i< destin.length; i++){
                let pathplan = bs.pos.findPathTo(destin[i], {range:3})
                    for(let q=0; q<pathplan.length; q++) {
                        Game.rooms[this.roomName].createConstructionSite(pathplan[q].x, pathplan[q].y, STRUCTURE_ROAD);
                        }
        }
    }

    tier1 (level, room) {

        let buildQue = [];
        let wanted = [C.STRUCTURE_TOWER, C.STRUCTURE_EXTENSION, C.STRUCTURE_STORAGE, C.STRUCTURE_SPAWN, C.STRUCTURE_TERMINAL, C.STRUCTURE_CONTAINER, C.STRUCTURE_ROAD]
        let want = _.mapValues(_.pick(C.CONTROLLER_STRUCTURES, wanted), level)
        let allSites = room.find(C.FIND_MY_CONSTRUCTION_SITES)
        let sites = _.groupBy(allSites, 'structureType')
        let have = _.mapValues(room.structures, 'length')
        want[C.STRUCTURE_CONTAINER] = Math.min(level, C.CONTROLLER_STRUCTURES[C.STRUCTURE_CONTAINER][level])
        let src = room.spawns[0] || undefined
        for (let type in want) {
            let amount = want[type] - ((have[type] || 0) + (sites[type] || []).length)
                console.log(type, want[type], have[type] || 0, (sites[type] || []).length)
            if (amount <= 0) continue
            console.log(`Want ${amount} of ${type}`)

            if (src.pos) {
                if (src instanceof StructureSpawn) {
                    // Make a array to store the config deconstructed
                    var blueprintXy = []
                    let maxYlength = Object.entries(layouts.default.layout).length;
                    //Loop through each line in the layout object for the design
                    for(let i = 0; i <= maxYlength; i++){
                        let linedata = layouts.default.layout[i];
                        if(linedata == undefined|null){
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
                        console.log(JSON.stringify(datafuckery))
                        blueprintXy.push(datafuckery)
                    }
                    
                    //By now I have an array of arrays. The first being omplete with arrays of the lines of buildings. Not decoded
                    

                    let rowBluePrint = Object.values(blueprintXy);
                    
                    
                    if(rowBluePrint.length != null || undefined){
                        
                    for (let e=0; e <maxYlength; e++){
                        l
                        let thline = rowBluePrint[e]
                        let thepos = thline.pos
                        let theline = thline.orderY

                        //Go through each letter
                        theline.forEach((letter,theX)=>{

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
                            if (!selection){
                                return
                            }    
                            let datafuckery2 = {
                                building: selection,
                                pos: {
                                    x: theX,
                                    y: thepos.y
                                }
                            }
                                buildQue.push(datafuckery2);
                        })
                    }
                }
                let spawn = buildQue.findIndex(item => item.building === C.STRUCTURE_SPAWN);
                let blueprintspawnpos = buildQue[spawn].pos
                
                function diff(a,b){return Math.abs(a-b);}

                let difX = diff(blueprintspawnpos.x, src.pos.x)
                let difY = diff(blueprintspawnpos.y, src.pos.y)
                

                    console.log("WE OUTTA THERE ", buildQue.length, " Also ", difX, " ", difY)
                    console.log(JSON.stringify(buildQue))

                buildQue.forEach(function (order){
                    let ordernewx = order.pos.x += difX;
                    let ordernewy = order.pos.y += difY;
                    //ORDER UP!
                let freespot = this.lookForAt(LOOK_STRUCTURES, ordernewx, ordernewy) | [];
                if(freespot.length == 0){
                switch(this.createConstructionSite(ordernewx, ordernewy, order.building)) {
                    case 0:
                        console.log("Creating ", order.building, " at (x,y) : ", ordernewx, " ", ordernewy)
                        break;
                    case -1:
                        console.log("Not Owner")
                        break;
                    case -7:
                        console.log("Bad Location!")
                        break;
                    case -8:
                        console.log("Construction Site Cap!")
                        break;
                    case -10:
                        console.log("Bad Location for ", order.building," ", ordernewx," ",ordernewy)
                        break;
                    case -14:
                        break;
                }



                }
                }, room)




                } else {
                return
                }
            }
                //room.createConstructionSite(pos, type)
                return
        }
        
        
            
        }


        /**
     * add structures to matrix so that impassible structures can be avoided and roads given a lower cost
     * @param room
     * @param matrix
     * @param roadCost
     * @returns {CostMatrix}
     */
    static addStructuresToMatrix(room, matrix) {
        let impassibleStructures = [];
        for (let structure of room.find(FIND_STRUCTURES)) {
            if (structure instanceof StructureRampart) {
                if (!structure.my && !structure.isPublic) {
                    impassibleStructures.push(structure);
                }
            }
            else if (structure instanceof StructureRoad) {
                matrix.set(structure.pos.x, structure.pos.y, 255);
            }
            else if (structure instanceof StructureContainer) {
                matrix.set(structure.pos.x, structure.pos.y, 5);
            }
            else {
                impassibleStructures.push(structure);
            }
        }
        for (let site of room.find(FIND_MY_CONSTRUCTION_SITES)) {
            if (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD
                || site.structureType === STRUCTURE_RAMPART) {
                continue;
            }
            matrix.set(site.pos.x, site.pos.y, 0xff);
        }
        for (let structure of impassibleStructures) {
            matrix.set(structure.pos.x, structure.pos.y, 0xff);
        }
        return matrix;
    }
        /**
     * check how many rooms were included in a route returned by findRoute
     * @param origin
     * @param destination
     * @returns {number}
     */
    static routeDistance(origin, destination) {
        let linearDistance = Game.map.getRoomLinearDistance(origin, destination);
        if (linearDistance >= 32) {
            return linearDistance;
        }
        let allowedRooms = this.findRoute(origin, destination);
        if (allowedRooms) {
            return Object.keys(allowedRooms).length;
        }
    }
    /* find a viable sequence of rooms that can be used to narrow down pathfinder's search algorithm
    * @param origin
    * @param destination
    * @param options
    * @returns {{}}
    */
    static findRoute(origin, destination, options = {}) {
        let restrictDistance = options.restrictDistance || Game.map.getRoomLinearDistance(origin, destination) + 10;
        let allowedRooms = { [origin]: true, [destination]: true };
        let highwayBias = 1;
        if (options.preferHighway) {
            highwayBias = 2.5;
            if (options.highwayBias) {
                highwayBias = options.highwayBias;
            }
        }
        let ret = Game.map.findRoute(origin, destination, {
            routeCallback: (roomName) => {
                if (options.routeCallback) {
                    let outcome = options.routeCallback(roomName);
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }
                let rangeToRoom = Game.map.getRoomLinearDistance(origin, roomName);
                if (rangeToRoom > restrictDistance) {
                    // room is too far out of the way
                    return Number.POSITIVE_INFINITY;
                }
                if (!options.allowHostile && Traveler.checkAvoid(roomName) &&
                    roomName !== destination && roomName !== origin) {
                    // room is marked as "avoid" in room memory
                    return Number.POSITIVE_INFINITY;
                }
                let parsed;
                if (options.preferHighway) {
                    parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                    if (isHighway) {
                        return 1;
                    }
                }
                // SK rooms are avoided when there is no vision in the room, harvested-from SK rooms are allowed
                if (!options.allowSK && !Game.rooms[roomName]) {
                    if (!parsed) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    }
                    let fMod = parsed[1] % 10;
                    let sMod = parsed[2] % 10;
                    let isSK = !(fMod === 5 && sMod === 5) &&
                        ((fMod >= 4) && (fMod <= 6)) &&
                        ((sMod >= 4) && (sMod <= 6));
                    if (isSK) {
                        return 10 * highwayBias;
                    }
                }
                return highwayBias;
            },
        });
        if (!_.isArray(ret)) {
            console.log(`couldn't findRoute to ${destination}`);
            return;
        }
        for (let value of ret) {
            allowedRooms[value.room] = true;
        }
        return allowedRooms;
    }

    getRange (s) {
        let range = 1
        let { pos, x, y, roomName } = s
        if (!pos) pos = { x, y, roomName }
        switch (s.structureType || s.type || '') {
          case '':
          case 'exit':
          case 'controller':
          case 'source':
            range = 3
            break
          case 'spawn':
            // range = 3
            break
        }
        return { pos, range }
      }
    
      findPos (origin, avoid) {
        console.log('findPos', origin, avoid)
        let result = PathFinder.search(origin, avoid, {
          flee: true,
          roomCallback (room) {
            let cm = new PathFinder.CostMatrix()
            avoid.forEach(({ pos: { x, y } }) => cm.set(x, y, 254))
            return cm
          }
        })
        if (result && result.path.length) {
          let vis = new RoomVisual()
          vis.poly(result.path.map(({x, y}) => [x, y]), { stroke: 'red' })
          return result.path.slice(-1)[0]
        }
      }
}