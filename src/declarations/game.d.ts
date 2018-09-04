interface Game {
    TargetCache: {
        tick: number;
        targets: { [ref: string]: string[] };
        build(): void;
    };
    cache: ICache;
    colonies: Colony[];
}

declare class GameChanger {

}
type Colonies = Colony[];
