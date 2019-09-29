import Init from './Init'
import ProcessTreeDump from './ProcessTreeDump'
import { bundle as spawn } from './spawn'
import { bundle as JuicedProcesses } from './JuicedProcesses'

export const bundle = {
  install (processRegistry, extensionRegistry) {
    processRegistry.register('init', Init)
    processRegistry.register('processTreeDump', ProcessTreeDump)
    spawn.install(processRegistry, extensionRegistry)
    JuicedProcesses.install(processRegistry, extensionRegistry)
  }
}
