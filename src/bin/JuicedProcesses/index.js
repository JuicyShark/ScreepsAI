import Room from './Room'
import Colony from './Colony'
import StackStateCreep from './StackStateCreep'
import HarvestManager from './HarvestManager'
import UpgradeManager from './UpgradeManager'
import TowerDefense from './TowerDefense'
import Intel from './Intel'
import FlagManager from './FlagManager'
import ColonyExpansion from './ColonyExpansion'
import Layout from './layout'
import Cron from './Cron'

export const bundle = {
  install (processRegistry, extensionRegistry) {
    processRegistry.register('JuicedProcesses/Colony', Colony)
    processRegistry.register('JuicedProcesses/Room', Room)
    processRegistry.register('JuicedProcesses/stackStateCreep', StackStateCreep)
    processRegistry.register('JuicedProcesses/harvestManager', HarvestManager)
    processRegistry.register('JuicedProcesses/upgradeManager', UpgradeManager)
    processRegistry.register('JuicedProcesses/towerDefense', TowerDefense)
    processRegistry.register('JuicedProcesses/intel', Intel)
    processRegistry.register('JuicedProcesses/flagManager', FlagManager)
    processRegistry.register('JuicedProcesses/colonyExpansion', ColonyExpansion)
    processRegistry.register('JuicedProcesses/layout', Layout)
    processRegistry.register('JuicedProcesses/cron', Cron)
  }
}
