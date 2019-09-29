const RUN_CRONS = true
const RUN_PROCESS_TREE_DUMP = true


const config = {
  services: [
    {
      id: 'cron',
      name: 'JuicedProcesses/cron',
      params: {},
      restart: true,
      enabled: RUN_CRONS
    },
    {
      id: 'Colony',
      name: 'JuicedProcesses/Colony',
      params: {},
      restart: true,
      enabled: true
    },
    {
      id: 'spawnManager',
      name: 'spawn/manager',
      params: {},
      restart: true,
      enabled: true
    },
    {
      id: 'processTreeDump',
      name: 'processTreeDump',
      params: {},
      restart: true,
      enabled: RUN_PROCESS_TREE_DUMP
    },
  ]
}
export default config
