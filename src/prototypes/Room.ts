// Room prototypes - commonly used room properties and methods

import { MY_USERNAME, MY_ALLY, roomTypes } from "config";
import { RoomBrain } from "ShowMaster/roomMaster";
import { SpawnBrain } from "./Spawn";
import { initializeRoomTask } from '../utils/initializer';
import { TargetCache } from '../utils/caching/gameCache';

Object.defineProperty(Room.prototype, 'RoomTask', {
    get() {
        if (!this._roomTask) {
            let protoRoomTask = this.memory.task;
            this._roomTask = protoRoomTask ? initializeRoomTask(protoRoomTask) : null;
        }
        return this._roomTask;
    },
    set(roomTask: RTask | null) {
        /* // Assert that there is an up-to-date target cache
         TargetCache.assert();
         // Unregister target from old task if applicable
         let oldProtoTask = this.memory.task as protoRoomTask;
         if (oldProtoTask) {
             let oldRef = oldProtoTask._target.ref;
             if (Game.TargetCache.targets[oldRef]) {
                 _.remove(Game.TargetCache.targets[oldRef], name => name == this.name);
             }
         }*/
        // Set the new task
        this.memory.task = roomTask ? roomTask.proto : null;
        if (roomTask) {
            // Register references to creep
            roomTask.room = this;
        }
        // Clear cache
        this._roomTask = null;
    }
});

Room.prototype.run = function (Colony: Colony): void {
    if (this.RoomTask) {
        return this.RoomTask.run(Colony);
    }

};
/*Object.defineProperty(Room.prototype, 'hasValidTask', {
    get() {
        return this._roomTask && this._roomTask.isValid();
    }

});*/

Object.defineProperty(Room.prototype, 'isIdle', {
    get() {
        return !this.hasValidRoomTask;
    }
});


//roomTask Class
/*
export class RoomTask {
    name: string;
    roomOrder: string;
    priority: number;
    details: SpawnTask | null;

    constructor(taskName: string, roomOrder, priority, details) {
        this.name = taskName;
        this.roomOrder = roomOrder;
        this.details = details;
        this.priority = priority

    }
}*/



// Logging =============================================================================================================
Object.defineProperty(Room.prototype, 'print', {
    get() {
        return '<a href="#!/room/' + Game.shard.name + '/' + this.name + '">' + this.name + '</a>';
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'memLog', {
    get() {
        if (!this.memory.log) {
            this.memory.log = [];
        }
        return this.memory.log;
    },
    set(log) {



        if (typeof log === "string") {

            let temp = { [Game.time]: log }
            this.memory.log.push(temp)
        }
        else if (typeof log !== "string") {
            let temp = { [Game.time]: JSON.stringify(log) }
            this.memory.log.push(temp)
        }
        return this.memory.log
    },
    configurable: true,
})

// Room properties =====================================================================================================

Object.defineProperty(Room.prototype, 'my', {
    get() {
        return this.controller && this.controller.my;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'owner', {
    get() {
        return this.controller && this.controller.owner ? this.controller.owner.username : undefined;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'reservedByMe', {
    get() {
        return this.controller && this.controller.reservation && this.controller.reservation.username == MY_USERNAME;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'signedByMe', {
    get() {
        return this.controller && this.controller.sign && this.controller.sign.text == Memory.settings.signature;
    },
    configurable: true,
});

//KODIES STUFF
/**
 * Object taskList currently seems to go away every tick. to solve that im just gonna run a colony function to grab its output and do shit with it
 */


Object.defineProperty(Room.prototype, 'roomType', {
    get() {
        var colony = Game.colonies[0]
        if (colony != undefined && colony.name != undefined) {
            if (this.name == colony.name) {
                return "ColonyHub"
            }
            else if (this.name != colony.name && this.hostiles.length == 0) {
                return "Outpost"
            }
            else if (this.hostiles != undefined && this.sourceKeepers.length >= 1) {
                return "SKRoom"
            }
            else if (this.hostiles != undefined && this.hostileStructures.lengh <= 5 && this.playerHostiles.length >= 1) {
                return "Enemy_Outpost"
            }
            else if (this.hostiles != undefined && this.hostileStructures.lengh >= 6 && this.playerHostiles.length >= 1) {
                return "Enemy_Base"
            }

        }
        else if (Game.colonies.length == 0) {
            return "ColonyHub"
        }
    },
    configurable: true,
})
Object.defineProperty(Room.prototype, 'isOutpost', {
    get(): Boolean {

        if (this.roomType == "Outpost") {
            return true
        } else { return false }

    },
    configurable: true,
})

// Room properties: creeps =============================================================================================

// Creeps physically in the room
Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) {
            this._creeps = this.find(FIND_MY_CREEPS);
        }
        return this._creeps;
    },
    configurable: true,
});

//Kodie Shit---------------

Object.defineProperty(Room.prototype, 'creepsByType', {
    get() {
        let output = _.groupBy(this.creeps, function (creep: Creep) { return creep.memory.type });
        return output



    },
    configurable: true,

})

// Room properties: hostiles ===========================================================================================

Object.defineProperty(Room.prototype, 'hostiles', {
    get() {
        if (!this._hostiles) {
            this._hostiles = this.find(FIND_HOSTILE_CREEPS);
        }
        return this._hostiles;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'invaders', {
    get() {
        if (!this._invaders) {
            this._invaders = _.filter(this.hostiles, (creep: Creep) => creep.owner.username == 'Invader');
        }
        return this._invaders;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'sourceKeepers', {
    get() {
        if (!this._sourceKeepers) {
            this._sourceKeepers = _.filter(this.hostiles, (creep: Creep) => creep.owner.username == 'Source Keeper');
        }
        return this._sourceKeepers;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'playerHostiles', {
    get() {
        if (!this._playerHostiles) {
            this._playerHostiles = _.filter(this.hostiles,
                (creep: Creep) => creep.owner.username != 'Invader'
                    && creep.owner.username != 'Source Keeper' && creep.owner.username != MY_ALLY());
        }
        return this._playerHostiles;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'dangerousHostiles', {
    get() {
        if (!this._dangerousHostiles) {
            this._dangerousHostiles = _.filter(this.hostiles,
                (creep: Creep) => creep.getActiveBodyparts(ATTACK) > 0
                    || creep.getActiveBodyparts(WORK) > 0
                    || creep.getActiveBodyparts(RANGED_ATTACK) > 0
                    || creep.getActiveBodyparts(HEAL) > 0);
        }
        return this._dangerousHostiles;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'dangerousPlayerHostiles', {
    get() {
        if (!this._dangerousPlayerHostiles) {
            this._dangerousPlayerHostiles = _.filter(this.playerHostiles,
                (c: Creep) => c.getActiveBodyparts(ATTACK) > 0
                    || c.getActiveBodyparts(WORK) > 0
                    || c.getActiveBodyparts(RANGED_ATTACK) > 0
                    || c.getActiveBodyparts(HEAL) > 0);
        }
        return this._dangerousPlayerHostiles;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'fleeDefaults', {
    get() {
        if (!this._fleeDefaults) {
            this._fleeDefaults = (<HasPos[]>[])
                .concat(_.filter(this.hostiles,
                    (c: Creep) => c.getActiveBodyparts(ATTACK) > 0
                        || c.getActiveBodyparts(RANGED_ATTACK) > 0))
                .concat(_.filter(this.keeperLairs,
                    (l: StructureKeeperLair) => (l.ticksToSpawn || Infinity) <= 10));
        }
        return this._fleeDefaults;
    },
    configurable: true,
});


// Hostile structures currently in the room
Object.defineProperty(Room.prototype, 'hostileStructures', {
    get() {
        if (!this._hostileStructures) {
            this._hostileStructures = this.find(FIND_HOSTILE_STRUCTURES, { filter: (s: Structure) => s.hitsMax });
        }
        return this._hostileStructures;
    },
    configurable: true,
});

// Room properties: flags ==============================================================================================

// Flags physically in this room
Object.defineProperty(Room.prototype, 'flags', {
    get() {
        if (!this._flags) {
            this._flags = this.find(FIND_FLAGS);
        }
        return this._flags;
    },
    configurable: true,
});

// Room properties: structures =========================================================================================)
Object.defineProperty(Room.prototype, 'constructionSites', {
    get() {
        if (!this._constructionSites) {
            this._constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);
        }
        return this._constructionSites;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'tombstones', {
    get() {
        if (!this._tombstones) {
            this._tombstones = this.find(FIND_TOMBSTONES);
        }
        return this._tombstones;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'drops', {
    get() {
        if (!this._drops) {
            this._drops = _.groupBy(this.find(FIND_DROPPED_RESOURCES), (r: Resource) => r.resourceType);
        }
        return this._drops;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'droppedEnergy', {
    get() {
        return this.drops[RESOURCE_ENERGY] || [];
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'droppedPower', {
    get() {
        return this.drops[RESOURCE_POWER] || [];
    },
    configurable: true,
});

//Kodies Movein shit
Room.prototype.handleMyRoom = function (): void {
    this.executeRoom()
}
Room.prototype.handleExternalRoom = function (colony: Colony): any {
    if (!this.controller) {
        //NO Controller
    } else {

        if (this.controller.owner != MY_ALLY) {
            return this.handleOccupiedRoom();
        }
        else if (this.controller.owner == MY_ALLY) {
            return this.handleAllyRoom()
        }
        if (this.controller.reservation && this.controller.reservation.username === Memory.username) {
            return this.handleReservedRoom();
        }
    }
    if (this.controller && !this.controller.reservation) {
        return this.handleUnreservedRoom();

    }
}
Room.prototype.handleUnreservedRoom = function (colony: Colony): void {
    if (this.isOutpost == true) {
        colony.room.memory.outposts.push(this.name)
    }
}
Room.prototype.handleOccupiedRoom = function (colony: Colony): void {

}
Room.prototype.handleExternalHighwayRoom = function (colony: Colony): void {

}
Room.prototype.handleReservedRoom = function (colony: Colony): void {

}
Room.prototype.handleAllyRoom = function (colony: Colony): void {

}

Room.prototype.executeRoom = function (colony: Colony): void {
    this.memory.lastSeen = Game.time;

    //records permanentObjs and refresh cache also runs the room timer
    RoomBrain.run(this)

    for (let i in roomTypes) {
        if (this.roomType == roomTypes[i]) {
            this.runMyType(colony)
        }
    }
}

Room.prototype.runMyType = function (colony: Colony) {
    if (this.roomType == "ColonyHub" && this.memory.timer != undefined) {
        if (this.memory.timer % 7 === 0) {
            //SpawnBrain.spawnForHub(colony)

            //this.checkandSpawn(colony)
        }
    }

}



Room.prototype.getRoomLocation = function (roomName: string): any {
    let thisString = roomName.split("");
    let temp1 = [];
    let swap: boolean = false;

    thisString.forEach(function (value: string, index: number) {
        if (!Number(value)) {
            swap = false;
            temp1.push(value);
        }
        else {
            temp1.push(Number(value))

        }
    })


    var output: any = temp1
    return JSON.stringify(output);
}
Room.prototype.decodeRoomLocation = function (roomPos: string) {
    let temp1 = [];

    for (let i = 0; i < roomPos.length; i++) {
        let result = JSON.parse(roomPos)[i];
        temp1.push(result)

    }
    let temp3: string = temp1.join("");
    return temp3;
}
