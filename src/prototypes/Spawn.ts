import { nameGen } from "../utils/nameGen";
StructureSpawn.prototype.spawnNewCreep = function (bodyParts: any, name: string): void {

    let newName = nameGen(name);
    var testCreep = this.spawnCreep(bodyParts, newName, {
        dryRun: true
    });
    if (testCreep == 0) {
        this.spawnCreep(bodyParts, newName);
        console.log("Spawning a " +bodyParts+ ", named " + newName);
    } else if (this.spawning) {
        console.log("Spawning " + name);
    } else {

        console.log("Spawn waiting with " + bodyParts)

    }
};
