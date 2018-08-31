
export class StructureTower{
    static pos: any;
  static defend(): any {
    // find closes hostile creep
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
 // if one is found...
    if (target != undefined) {
    // ...FIRE!
    this.attack(target);
    }
  }
    static attack(target: any): any {
    }
}