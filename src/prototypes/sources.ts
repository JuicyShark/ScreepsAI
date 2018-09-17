Source.prototype.hasContainer = function (): boolean {
    if (this.pos.findClosestByLimitedRange(this.room.containers, 2)) {
        return true
    }
    else {
        return false
    }
}
