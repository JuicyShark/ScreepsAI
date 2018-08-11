
module.exports.loop = function() {

  // for each creeps run creep logic
  for (let name in Game.creeps) {
    Game.creeps[name].suicide();
  }


};
