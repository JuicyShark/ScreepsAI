   Creep.prototype.runRole =
        function() {
          let upgrader = require("role.upgrader")
          let harvester = require("role.harvester")


          if (this.memory.role == "Harvester"){
            if (this.memory.role == "Harvester"){
              harvester.run(this);
            }
          }
          if (this.memory.role == "Upgrader"){
            if (this.memory.role == "Upgrader"){
              upgrader.run(this);
            }
          }
          /*

          if (this.memory.role == "Upgrader"){
            upgrader.run(this)
          }*/

            //roles[this.memory.role].run(this);
        };
