export interface GameMemory {
  uuid: number;
  log: any;
  memVersion: any;
  creeps:
  {
    [name: string]: any
  };
  flags:
  {
    [name: string]: any
  };
  rooms:
  {
    [name: string]: any
  };
  spawns:
  {
    [name: string]: any
  };
}

export function m(): GameMemory
{
  return Memory as any as GameMemory
}