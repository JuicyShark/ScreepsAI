import { initializeRoomTask } from '../utils/initializer'

export abstract class RoomTask implements RTask {

    static taskName: string;


    name: string;
    _room: Room;
    _parent: protoRoomTask | null;
    tick: number;
    settings: RoomTaskSettings;
    options: RoomTaskOptions;
    data: RoomTaskData;
    constructor(taskName: string, data: RoomTaskData, options = {} as RoomTaskOptions) {
        this.name = taskName;
        this._parent = null;
        this.settings = {
            timeout: 20
        }
        _.defaults(options, {

        });
        this.tick = Game.time;
        this.options = options;
        if (!data) {
            this.data = null;
        }
        else {
            this.data = data;
        }
    }

    /*get proto(): protoRoomTask {
        return {
            name: this.name;
            _parent: this._parent,
            options: this.options,
            data: this.data,
            tick: this.tick,
        }
    }*/

    set proto(protoRoomTask: protoRoomTask) {
        this._parent = protoRoomTask._parent;
        this.options = protoRoomTask.options;
        this.data = protoRoomTask.data;
        this.tick = protoRoomTask.tick;
    }

    get room(): Room { //Gets Tasks own Room by its name
        return Game.rooms[this._room.name];
    }

    set room(room: Room) {
        this._room.name = room.name;
    }

    get parent(): RoomTask | null {
        return (this._parent ? initializeRoomTask(this._parent) : null)
    }
    set parent(parentTask: RoomTask | null) {
        this._parent = parentTask ? parentTask.proto : null;

        if (this.room) {
            this.room.RoomTask = this
        }
    }

    get manifest(): RoomTask[] {
        let manifest: RoomTask[] = [this];
        let parent = this.parent;
        while (parent) {
            manifest.push(parent);
            parent = parent.parent;
        }
        return manifest;
    }

    // Test every tick to see if task is still valid
    abstract isValidRoomTask(): boolean;

    isValid(): boolean {
        let validRoomTask = false;
        if (this._room) {
            validRoomTask = this.isValidRoomTask();
        }
        if (validRoomTask) {
            return true;
        } else {
            // Switch to parent task if there is one
            this.finish();
            return this.parent ? this.parent.isValid() : false;
        }
    }

    run(): number | null {
        //Execute this each Tick
        let result = this.work();
        if (result == OK) {
            this.finish();
        }
        return result;
    }

    abstract work(): number;

    finish(): void {
        if (this.room) {
            this.room.RoomTask = this.parent
        } else {

            console.log(`Room having issues executing ${this.name}!`);
        }
    }
}
