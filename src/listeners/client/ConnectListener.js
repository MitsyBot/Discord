const Listener = require('../../structures/events/Listener')
const { EmbedBuilder, Logger } = require('../../utils')

module.exports = class ConnectListener extends Listener {
  constructor() {
    super()
    this.event = 'connect'
  }

  async on(client, shardID) {
    client.shardUptime.set(shardID, {
      shardID,
      uptime: Date.now()
    })

    Logger.shardMessage(`Woof! A shard ${shardID} esta online novamente!`)
  }
}
