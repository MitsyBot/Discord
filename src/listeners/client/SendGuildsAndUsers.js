const Listener = require('../../structures/events/Listener')
const { Logger } = require('../../utils')

const axios = require('axios')

module.exports = class SendDataListener extends Listener {
  constructor() {
    super()
    this.event = 'sendData'
  }

  async on(client) {
    if (process.env.PRODUCTION === 'true') {
    setInterval(() => {
        axios({
            url: `${process.env.API_URL}/guildsusers`,
            method: 'put',
            data: {
              guilds: client.guilds.size,
              users: client.users.size,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.API_TOKEN,
            },
          })
        Logger.debug(`Servidores e usuarios enviados para o a Api`)
    }, 20 * 1000)
  }
  }
}