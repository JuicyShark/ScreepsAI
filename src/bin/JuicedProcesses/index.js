import Room from './Room'
import Colony from './Colony'
import StackStateCreep from './StackStateCreep'
import HarvestManager from './HarvestManager'
import UpgradeManager from './UpgradeManager'
import TowerDefense from './RoomDefense'
import Intel from './Intel'
import SeasonalBrain from './SeasonalBrain'
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
    processRegistry.register('JuicedProcesses/roomDefense', TowerDefense)
    processRegistry.register('JuicedProcesses/intel', Intel)
    processRegistry.register('JuicedProcesses/SeasonalBrain', SeasonalBrain)
    processRegistry.register('JuicedProcesses/flagManager', FlagManager)
    processRegistry.register('JuicedProcesses/colonyExpansion', ColonyExpansion)
    processRegistry.register('JuicedProcesses/layout', Layout)
    processRegistry.register('JuicedProcesses/cron', Cron)
  }
}
