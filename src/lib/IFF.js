import C from '/include/constants'

const OFFICIAL = {
  allied: {
    'CrazedGod': true,
    'Juicy-Shark': true
  },
  friends: {
  
  }
}

const SHARD = {
  DEFAULT: {
    allied: {'CrazedGod': true,
    'Juicy-Shark': true, 
    'crazed': true
  },
    friends: {}
  },
  shard0: OFFICIAL,
  shard1: OFFICIAL,
  shard2: OFFICIAL,
  screepsplus1: {
    allied: {'CrazedGod': true,
    'Juicy-Shark': true},
    friends: {
      
    }
  }
}

const current = SHARD[Game.shard.name] || SHARD.DEFAULT

export default class IFF {
  static isFriend (user) {
    if (current.friends[user]) return true
    if (IFF.isAlly(user)) return true
    else    return false
  }
  static isFoe (user) {
    return !IFF.isFriend(user)
  }
  static isAlly (user) {
    if (current.allied[user]) return true
    else    return false
  }
  static refresh () {
    // TODO: Use segment for server specific lists
    // TODO: Import LOAN segment if available
  }
  static notAlly({ owner: { username } = {}}) {
    return !IFF.isAlly(username)
  }

  static notFriend({ owner: { username } = {}}) {
    return !IFF.isFriend(username)
  }
}
