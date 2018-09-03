import { getAllColonies, Colony } from './Colony';
interface GameChangerMemory {

}
export class GameChanger {
  memory: GameChangerMemory;
  Colonies: Colony[];
  baseColony: Colony;


  constructor() {
    this.build()
  }

  build(): void {
  }


}
