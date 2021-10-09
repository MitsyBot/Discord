const Logger = require('../../structures/util/Logger')
const Bot = require('../../structures/Bot')

module.exports = class Cluster {
  constructor() {
    Logger.info('Spawnando shards')
    if (process.env.PRODUCTION === 'true' && !process.env.MONGO_URI) {
      Logger.error('Modo produção ativado sem MONGO_URI no .env.')
    }
    if (process.env.PRODUCTION === 'false' && !process.env.MONGO_URI) {
      Logger.warning('Iniciando o bot sem a URL do mongodb no .env.')
    }
    this.spawnShards()
  }

  async spawnShards() {
    this.shardManager = new Bot(process.env.DISCORD_TOKEN, {
      firstShardID: this.firstClusterShardID,
      lastShardID: this.firstClusterShardID + (parseInt(process.env.SHARDS_PER_CLUSTER) - 1),
      maxShards: parseInt(process.env.SHARD_AMOUNT),
      defaultImageFormat: 'png',
      defaultImageSize: 2048,
      restMode: true,
      allowedMentions: {
        everyone: false,
        roles: false,
        users: true,
        repliedUser: true
      },
      intents: 14079,
      rest: {
        baseURL: '/api/v9'
      }
    })

    try {
      await this.shardManager.connect().then(() => {
        Logger.debug('Conectado ao gateway do discord com sucesso.')
      })
    } catch (e) { }
  }

  get firstClusterShardID() {
    if (process.env.CLUSTER_ID === '0') return 0
    return parseInt(process.env.CLUSTER_ID) * parseInt(process.env.SHARDS_PER_CLUSTER)
  }
}
