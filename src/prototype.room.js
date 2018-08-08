
Room.prototype.findSource = function(room){

    if(!room.memory.sources){//If this room has no sources memory yet
        room.memory.sources = {}; //Add it
        var sources = room.find(FIND_SOURCES);//Find all sources in the current room
        for(var i in sources){
            var source = sources[i];
            source.memory = room.memory.sources[source.id] = {}; //Create a new empty memory object for this source
            //Now you can do anything you want to do with this source
            //for example you could add a worker counter:
            source.memory.workers = 0;
        }
    }else{ //The memory already exists so lets add a shortcut to the sources its memory
        var sources = room.find(FIND_SOURCES);//Find all sources in the current room
        for(var i in sources){
            var source = sources[i];
            source.memory = this.memory.sources[source.id]; //Set the shortcut
        }
    }
}
/*if (!spawn.memory.sourceNodes) {
  spawn.memory.sourceNodes = {};
  var sourceNodes = spawn.room.find(FIND_SOURCES);
  for (var i in sourceNodes) {
    source = sourceNodes[i];
    source.memory = spawn.memory.sourceNodes[source.id] = {};
    source.memory.workers = 0
  }
} else {
  var sourceNodes = spawn.room.find(FIND_SOURCES);
  for (var i in sourceNodes) {
    source = sourceNodes[i];
    source.memory = spawn.memory.sourceNodes[source.id];
  }
}*/
