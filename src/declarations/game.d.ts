interface Game {
    TargetCache: {
        tick: number;
        targets: { [ref: string]: string[] };
        build(): void;
    };
    cache: ICache;
}

declare class GameChanger {

}
type Colonies = Colony[];
