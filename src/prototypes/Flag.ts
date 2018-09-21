
Object.defineProperty(Flag.prototype, "isScoutFlag", {
    get() {
        if (this.name == "Scout") {

            return true;
        }
        else {
            return false;
        }
    },
    configurable: true,

})
/*
Object.defineProperty(Flag.prototype, "", {
    get() {

    },
    configurable: true,

})*/
