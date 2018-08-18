var config = require("config")

//Work in progress and not applied anywhere yet


/** @function createTask
    @param {string} name  // String name of the task,                                example: TASK_HARVEST
    @param {string} typeNeeded  // String of the Type of body needed for task,       example: TYPE_ALLROUND
    @param {number} priority  // number of the priority of tasks assign tasks starting from one first
    @param {object} details   // further details of the task including target/s and any id's of things associated
   // create a task to assign in a queue
    */
Room.prototype.createTask = function(name, typeNeeded, priority, details) {
  var task = {name: name, typeNeeded: typeNeeded, priority: priority, details: details}
  //Have Queue in each room?? gonna check conversion to colony objects and maybe sort logic through that
  this.memory.taskList.push(task)
}
Room.prototype.assignTask = function(){

}
