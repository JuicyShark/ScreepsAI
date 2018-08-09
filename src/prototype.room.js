Room.prototype.findSource = function(room){
    if(!room.memory.sourceNodes){
        room.memory.sourceNodes = {};
        var sourceNodes = room.find(FIND_SOURCES);
        for(var i in sourceNodes){
            var source = sourceNodes[i];
            source.memory = room.memory.sourceNodes[source.id] = {};
            source.memory.workers = 0;
        }
    }else{
        var sourceNodes = room.find(FIND_SOURCES);
        for(var i in sourceNodes){
            var source = sourceNodes[i];
            source.memory = this.memory.sourceNodes[source.id];
            let worker = source.pos.findInRange(FIND_MY_CREEPS, 1)
            }
              source.memory.workers = worker.length;
        }
    }
}
