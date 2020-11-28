import scout from './scout'
import protector from './protector'
import upgrader from './upgrader'
import builder from './builder'
import feeder from './feeder'
import collector from './collector'
import claimer from './claimer'
import miner from './miner'
import harvester from './harvester'
import base from './base'
import core from './core'
import commonTasks from './commonTasks'

let parts = [
  core,
  base,
  commonTasks,
  harvester,
  miner,
  claimer,
  collector,
  feeder,
  protector,
  upgrader,
  builder,
  scout
]

export default class states {}

parts.forEach(part => {
  for (let k in part) {
    Object.defineProperty(states.prototype, k, { value: part[k] })
  }
})
