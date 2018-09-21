

interface Flag {
    isScoutFlag: boolean;
}

interface ScoutFlag {
    scoutPresent: Creep | undefined;
    scoutAssigned: Creep | undefined;
}

interface FlagMemory extends ScoutFlag {

}
