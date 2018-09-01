
export class Mem {
  static wrap(memory: any, memName: string, defaults = {}, deep = false) {
    if (!memory[memName]) {
      memory[memName] = _.clone(defaults)
    }
    if (deep) {
      _.defaultsDeep(memory[memName], defaults);
    } else {
      _.defaults(memory[memName])
    }
    return memory[memName]
  }

  private static _setDeep(object: any, keys: string[], value: any): void {
    let key = _.first(keys)
    keys = _.drop(keys)
    if (keys.length == 0) { // at the end
      object[key] = value
      return
    } else {
      if (!object[key]) {
        object[key] = {}
      }
      return Mem._setDeep(object[key], keys, value)
    }
  }

  /* Recursively set a value of an object given a dot-separated key, adding intermediate properties as necessary
     * Ex: Mem.setDeep(Memory.colonies, 'E1S1.miningSites.siteID.stats.uptime', 0.5) */
  static setDeep(object: any, keyString: string, value: any): void {
    let keys = keyString.split('.');
    return Mem._setDeep(object, keys, value)
  }

}