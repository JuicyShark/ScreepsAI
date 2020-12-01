export default {




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
        if (freespot == undefined) {
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

    },
    flex(room) {
        if (_.size(Game.constructionSites) === 100) return
        let level = room.controller.level

        let offGrid = [C.STRUCTURE_CONTAINER, C.STRUCTURE_ROAD]
        let wanted = [C.STRUCTURE_TOWER, C.STRUCTURE_EXTENSION, C.STRUCTURE_STORAGE, C.STRUCTURE_SPAWN, C.STRUCTURE_TERMINAL]
        let want = _.mapValues(_.pick(C.CONTROLLER_STRUCTURES, wanted), level)
        let allSites = room.find(C.FIND_MY_CONSTRUCTION_SITES)
        let sites = _.groupBy(allSites, 'structureType')
        let have = _.mapValues(room.structures, 'length')
        if (level > 1) {
            want[C.STRUCTURE_CONTAINER] = Math.min(level, C.CONTROLLER_STRUCTURES[C.STRUCTURE_CONTAINER][level])
        }
        if (level >= 4) {
            want[C.STRUCTURE_CONTAINER] = 0
        }
        // if (level < 3) {
        //   want[C.STRUCTURE_EXTENSION] = 0
        //   want[C.STRUCTURE_CONTAINER] = 0
        // }
        let src = room.spawns[0] || room.controller
        for (let type in want) {
            let amount = want[type] - ((have[type] || 0) + (sites[type] || []).length)
            console.log(type, want[type], have[type] || 0, (sites[type] || []).length)
            if (amount <= 0) continue
            let positions = [
                ...allSites,
                ...room.structures.all,
                ...room.find(C.FIND_EXIT),
                ...room.find(C.FIND_SOURCES)
            ].map(this.getRange)
            //console.log(`Want ${amount} of ${type}`)
            let pos = this.findPos(src.pos, positions, offGrid.includes(type))
            if (pos) {
                room.createConstructionSite(pos, type)
                return
            }
        }
    },

    getRange(s) {
            let range = 1
            let {
                pos,
                x,
                y,
                roomName
            } = s
            if (!pos) pos = {
                x,
                y,
                roomName
            }
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
            return {
                pos,
                range
            }
        },

        findPos(origin, avoid, invert = false) {
            console.log('findPos', invert, origin, avoid)
            let result = PathFinder.search(origin, avoid, {
                flee: true,
                roomCallback(room) {
                    let cm = new PathFinder.CostMatrix()
                    for (let x = 0; x < 50; x++) {
                        for (let y = 0; y < 50; y++) {
                            let grid = x % 2 === y % 2
                            if (invert) grid = !grid
                            let v = grid && x > 2 && x < 48 && y > 2 && y < 48
                            if (!v) cm.set(x, y, 255)
                        }
                    }
                    avoid.forEach(({
                        pos: {
                            x,
                            y
                        }
                    }) => cm.set(x, y, 254))
                    return cm
                }
            })
            if (result && result.path.length) {
                let vis = new RoomVisual()
                vis.poly(result.path.map(({
                    x,
                    y
                }) => [x, y]), {
                    stroke: 'red'
                })
                return result.path.slice(-1)[0]
            }
        }




}