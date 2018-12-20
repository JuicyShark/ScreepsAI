
/**
 * Gathers Player UserName
 */
function getUsername(): string {
  for (let i in Game.rooms) {
    let room = Game.rooms[i]

    if (room.controller && room.controller.my) {
      return room.controller.owner.username
    }
  }
  //if not returned then
  console.log('ERROR: Could not determine username.');
  return 'ERROR: Could not determine username.';
}
export const MY_USERNAME: string = getUsername();
export function MY_ALLY(): string {
  let Team: string[] = [
    "Juicy-Shark",
    "CrazedGod"
  ]
  let MY_ALLY: string;
  Team.forEach(function (usr) {
    if (usr != MY_USERNAME) {
      MY_ALLY = usr;
    }
  })
  return MY_ALLY
}
//CPU BUCKET LIMITS
export const minBucket: number = 3000;
export const safeBucketLimit: number = 8000;

export var roomTypes: string[] = [
  //Colony RoomTypes
  "ColonyHub",
  "Basic",
  "Spawner",
  "Highway",
  "Outpost",
  //Other Room Types
  "Enemy_Base",
  "Enemy_Outpost",
  "Ally_Base",
  "Ally_Outpost",
  "SKRoom"
]

export var creepTypes: string[] = [
  "GeneralHand",
  "Builder",
  "Upgrader",
  "Miner",
  "Lorry",
  "Patroller",
  "Defender",
  "Attacker",
  "Scout"
]
