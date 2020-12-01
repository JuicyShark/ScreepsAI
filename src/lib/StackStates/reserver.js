export default {
  reserver (target, id) {
    let tgt = this.resolveTarget(target)
    if (id) {
      this.push('reserveController', id)
      this.push('say', 'MINE!', true)
      this.push('moveNear', tgt)
    } else {
      if (this.creep.pos.roomName !== tgt.roomName) {
        this.push('moveToRoom', tgt)
      } else {
        console.log(`reserver hit end of logic, finding controller`)
        let { controller } = this.creep.room
        this.push('reserver',controller.pos, controller.id)
      }
    }
    this.runStack()
  }
}
