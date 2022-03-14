const fetch = require('node-fetch');

const defaultApplications = {
  youtube: '880218394199220334',
  youtubedev: '880218832743055411',
};

class DiscordTogether {
  constructor(client, applications = defaultApplications) {
    if (!client) throw new SyntaxError('Invalid Discord.Client !');

    this.client = client;
    this.applications = { ...defaultApplications, ...applications };
  }

  async createTogetherCode(voiceChannelId, option) {
    let returnData = {
      code: 'none',
    };
    if (option && this.applications[option.toLowerCase()]) {
      let applicationID = this.applications[option.toLowerCase()];
      try {
        await fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, {
          method: 'POST',
          body: JSON.stringify({
            max_age: 86400,
            max_uses: 0,
            target_application_id: applicationID,
            target_type: 2,
            temporary: false,
            validate: null,
          }),
          headers: {
            Authorization: `Bot ${this.client.token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((invite) => {
            if (invite.error || !invite.code) throw new Error('Ocorreu um erro ao retornar os dados!');
            if (Number(invite.code) === 50013) console.warn('O bot nao tem permissoes para fazer isso');
            returnData.code = `https://discord.com/invite/${invite.code}`;
          });
      } catch (err) {
        throw new Error('Ocorreu um erro ao iniciar youtube2gether client!');
      }
      return returnData;
    } else {
      throw new SyntaxError('Opção invalida!');
    }
  }
}

module.exports = DiscordTogether;