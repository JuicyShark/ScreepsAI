import { logger } from "loggerMadMan/logger";
//imports 
/*require("prototype.spawn")
var config = require("config")
require("prototype.roomBrain")
require("prototype.finder")*/

export class Rooms {
  static controller: any;
  static memory: any;
  static energyAvailable: string;
  static energyCapacityAvailable: string;
  static structures: any;
  static constructionSites: any;
  static sourceNodes: any[];
  static hostileSpawns: any[];
  static containers: any[];



  public static createNeeds(): any {
    var spawns = this.memory.structureIDs.Spawns
    if (spawns.length > 0) {
      var spawn:any = Game.getObjectById(spawns[0]);
      console.log(this.energyAvailable + "/" + this.energyCapacityAvailable + " Is the Current Energy @ " + this.name)
      if (this.findType("ALL_ROUND").length == 0) {
        spawn.spawnBasicAllRounder()
      } else if (this.needBasicWorker()) {
        logger.error("Basic HERE!")
        spawn.spawnAllRounder()
      } else if (this.needLorry()) {
        logger.error("Lorry HERE!")
        spawn.spawnLorry()
      } else if (this.needUpgrader()) {
        logger.error("Upgrader HERE!")
        spawn.spawnUpgrader()
      } else if (this.needContainerMiner()) {
        logger.error("Container HERE!")
        spawn.spawnContainerMiner()
      } else {
        console.log("Needs have been Met!")
        console.log(this.energyAvailable + "/" + this.energyCapacityAvailable + " Is the energy Capacity of the room")
      }
    }
  }
  static findType(arg0: string): any {
    throw new Error("Method not implemented.");
  }
  static needBasicWorker(): any {
    throw new Error("Method not implemented.");
  }
  static needLorry(): any {
    throw new Error("Method not implemented.");
  }
  static needUpgrader(): any {
    throw new Error("Method not implemented.");
  }
  static needContainerMiner(): any {
    throw new Error("Method not implemented.");
  }

static tick(): any {

  if (this.isMine()) {
    if (!this.memory.timer || this.memory.timer % 60 === 0) {
      this.memory.timer = -1;
      this.memoryInit();
      this.memory.timer = 60;
      console.log(this.name + " Timer has been reset")
    }
      this.loadSource();
    if (this.memory.timer % 15 == 0) {
      this.initCreeps();
    }
    if (this.memory.timer % 16 == 0) {
      this.constantTasks();
      this.createNeeds();
    }
    // load things needed each tick without if statement
    this.loadConstructionSites();
  //  console.log("YEP")

    --this.memory.timer;
  }
  // Room is not Ours
  else {
    this.processAsGuest();
  }
}
  static constantTasks(): any {
    throw new Error("Method not implemented.");
  }
  static processAsGuest(): any {
    throw new Error("Method not implemented.");
  }



// need to start applying types to creeps based on body bodyParts
// need to create a legend of types and what tasks they are most suitable for
/*Legend can go in config file? */
public static initCreeps(): any {
  if (!this.memory.creepsByType) {
    this.memory.creepsByType = config.defaultMem.creepTypes
  }
  let output = [];
     Object.keys(this.memory.creepsByType).forEach(i => {
    let list = this.memory.creepsByType[i]

    list.creeps = []
    let findCreeps = this.findType(list.type)
    for (var a = 0; a < findCreeps.length; a++) {
      var thisCreep = Game.getObjectById(findCreeps[a].id)
      if (thisCreep instanceof Creep) {
        if (thisCreep.memory.type == list.type) {
          list.creeps.push(thisCreep.id)

        }
      }
    }
  })
}
public static memoryInit(): any {
  if (!this.memory.taskList) {
    this.memory.taskList = []
  }
  this.initStructures();
  this.initContainers();
  this.initConstructionSites();
  this.initSource();
  this.sourceNodesLoop();
}
  public static sourceNodesLoop(): any {
    throw new Error("Method not implemented.");
  }
  public static initStructures(): any {

  if (!this.memory.structureIDs) {
    this.structures = this.find(FIND_MY_STRUCTURES);
    this.memory.structureIDs = config.defaultMem.RoomStructureMem;
    let mem = this.memory.structureIDs;
    for (var i = 0; i < this.structures.length; i++) {
      if (this.structures[i].structureType == "tower") {
        mem.Towers.push(this.structures[i].id)
      }
      if (this.structures[i].structureType == "spawn") {
        mem.Spawns.push(this.structures[i].id)
      }
      if (this.structures[i].structureType == "extension") {
        mem.Extensions.push(this.structures[i].id)
      }
      if (this.structures[i].structureType == "road") {
        mem.Roads.push(this.structures[i].id)
      }
    }
    mem.controller.id = this.controller.id;
  }
}

  public static initContainers(): any {
  var containers:any[] = this.find(FIND_STRUCTURES, {
    filter: {
      structureType: STRUCTURE_CONTAINER
    }
  });
  if (containers) {
    for (var i = 0; i < containers.length; i++) {
      if (containers[i] instanceof StructureContainer) {
        this.memory.structureIDs.Containers[i] = containers[i].id
      } else {
        console.log('Container is not instanceof SturctureContainer')
        containers.splice(i);
      }
    }
  }
}
public static initConstructionSites(): any {
  this.memory.constructionSites = [];
  this.constructionSites = this.find(FIND_CONSTRUCTION_SITES)
  for (var i = 0; i < this.constructionSites.length; i++) {
    this.memory.constructionSites[i] = this.constructionSites[i].id
    this.initConstructionTasks(this.constructionSites[i])
  }
}
public static initConstructionTasks(constructionSite:any): any {
  let siteType = constructionSite.structureType

  let priorityList = Object.entries(config.taskPriorities.constructionSites)
  for (let i = 0; i < priorityList.length; i++) {
    let sortingType = priorityList[i]
    if (siteType == sortingType[0]) {
      let selectedPriority = sortingType[1];
      let details = {
        target: constructionSite.id
      };
      this.createTask("BUILD", "ALL_ROUND", selectedPriority, details)
    }
  }
}
public static createTask(arg0: string, arg1: string, selectedPriority: {}, details: any): any {
    throw new Error("Method not implemented.");
  }
  public static initSource(): any {
  this.memory.hostileSpawns = this.find(STRUCTURE_KEEPER_LAIR);
  if (!this.memory.sourceNodes) {
    this.memory.sourceNodes = {}
  }
  var sources = this.find(FIND_SOURCES)
  for (var i = 0; i < sources.length; i++) {
    var source = sources[i]
    if (!this.memory.sourceNodes[source.id]) {
      this.memory.sourceNodes[source.id] = {
        id: source.id,
        toBuild: config.buildingLevels.sources,
        container: null
      }
    }
    if (this.memory.sourceNodes[source.id].container == null) {
      let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (s) => s.structureType === STRUCTURE_CONTAINER
      });
      if (containers != null || containers != undefined) {
        this.memory.sourceNodes[source.id].container = containers[0].id;
      }
    }
  }
}
public static level(): any {
  if (this.isMine()) {
    return this.controller.level
  } else {
    return 0
  }
}
public static safeGuardUp(): any {
  console.log("ENEMYSPOTTED!")
  this.controller.activateSafeMode()
}
  public static loadSource(): any {
  this.sourceNodes = []
  Object.keys(this.memory.sourceNodes).forEach(ID => {
    this.sourceNodes[ID] = Game.getObjectById(ID)
  })
  this.hostileSpawns = [];
  for (var i = 0; i < this.memory.hostileSpawns.length; i++) {
    this.hostileSpawns[i] = Game.getObjectById(this.hostileSpawns[i].id)
  }
}
public static loadContainers(): any {
  this.containers = [];
  for (var id = 0; id < this.memory.structureIDs.Containers.length; id++) {
    this.containers[id] = (Game.getObjectById(this.memory.structureIDs.Containers[id]));
  }
}
public static loadConstructionSites():any {
  this.constructionSites = [];
  for (var i = 0; i < this.memory.constructionSites.length; i++) {
    this.constructionSites[i] = (Game.getObjectById(this.memory.constructionSites[i]));
  }
};
}