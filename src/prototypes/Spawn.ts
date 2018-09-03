import { nameGen } from "../utils/nameGen";
StructureSpawn.prototype.spawnNewCreep = function (bodyParts: any, role: string, home: string): void {

    let newName = nameGen(role);
    var testCreep = this.spawnCreep(bodyParts, newName, {
        dryRun: true
    });
    if (testCreep == 0) {
        this.spawnCreep(bodyParts, newName + Game.time, {
            memory: {
                role: role,
                home: home
            }
        });
        console.log("Spawning a " + role + ", named " + newName);
    } else if (this.spawning) {
        console.log("Spawning " + newName);
    } else {

        console.log("Spawn waiting with " + role)

    }
};
