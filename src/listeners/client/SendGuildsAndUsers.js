const Listener = require('../../structures/events/Listener')
const { Logger } = require('../../utils')

const axios = require('axios')

module.exports = class SendDataListener extends Listener {
  constructor() {
    super()
    this.event = 'sendData'
  }

  async on(client) {
    if (process.env.PRODUCTION === false) {
    setInterval(() => {
        axios({
            url: 'http://127.0.0.1:3000/api/v2/guildsusers',
            method: 'put',
            data: {
              guilds: client.guilds.size,
              users: client.users.size,
            },
          })
        Logger.debug(`Servidores e usuarios enviados para o a Api`)
    }, 20 * 1000)
  }
  }
}