interface Game {
    colonies: Colony[];
    TargetCache: {
        tick: number;
        targets: { [ref: string]: string[] };
        build(): void;
    };
    cache: ICache;
}
