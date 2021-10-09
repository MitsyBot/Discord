const Listener = require('../../structures/events/Listener')
const { TopGGUtils, Logger } = require('../../utils')
module.exports = class ReadyConnectionListener extends Listener {
  constructor() {
    super()
    this.send = false;
    this.event = 'readyConnection'
  }

  async on(client) {
    client.cacheManager.start()
    const top_gg = new TopGGUtils()
    await top_gg.post(client)
    const game = [
        { name: `Yay | Cluster ${process.env.CLUSTER_ID} [${Number(client.clusters.firstShardID) + Number(process.env.SHARDS_PER_CLUSTER)}]`, type: 2 },
        { name: `Fazendo carinho no jeremias | Cluster ${process.env.CLUSTER_ID} [${Number(client.clusters.firstShardID) + Number(process.env.SHARDS_PER_CLUSTER)}]`, type: 2 },
        { name: `Acesse mitsy.website para conseguir ajuda e suporte | Cluster ${process.env.CLUSTER_ID} [${Number(client.clusters.firstShardID) + Number(process.env.SHARDS_PER_CLUSTER)}]`, type: 2 },
        { name: `Use -help para ver todos os meus comandos | Cluster ${process.env.CLUSTER_ID} [${Number(client.clusters.firstShardID) + Number(process.env.SHARDS_PER_CLUSTER)}]`, type: 2 },
]
    if (!this.send) {
      /**
       * @description Isso vai servir pra adicionar novas coisas
       */
      this.send = true
      const update = () => {
        setTimeout(() => {
          const status = Math.floor(Math.random() * game.length)
          client.editStatus('online', game[status])
        }, 7 * 1000)
      }
      update()
    }

    setInterval(() => {
      const status = Math.floor(Math.random() * game.length)
      client.editStatus('online', game[status])
    }, 20 * 1000) // 20 segundos pra evitar updates desnecessarios
    if (process.env.CLUSTERS === true) {
      Logger.info(`As shards de ${client.clusters.firstShardID} - ${Number(client.clusters.firstShardID) + Number(process.env.SHARDS_PER_CLUSTER)} Estão online.`)
    } else {
      Logger.info('Shards conectadas!')
    }
  }
}