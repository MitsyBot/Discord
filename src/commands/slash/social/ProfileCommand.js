const { Command, Emoji } = require('../../../utils')
const axios = require('axios')
const { CommandOptions, CommandBase } = require('eris')

const flags = [
  {
    flag: 1 << 0,
    name: 'discord_employee'
  },
  {
    flag: 1 << 1,
    name: 'discord_partner'
  },
  {
    flag: 1 << 2,
    name: 'hypesquad_events'
  },
  {
    flag: 1 << 3,
    name: 'bug_hunter'
  },
  {
    flag: 1 << 6,
    name: 'hypesquad_bravery'
  },
  {
    flag: 1 << 7,
    name: 'hypesquad_brilliance'
  },
  {
    flag: 1 << 8,
    name: 'hypesquad_balance'
  },
  {
    flag: 1 << 9,
    name: 'early_supporter'
  },
  {
    flag: 1 << 12,
    name: 'null'
  },
  {
    flag: 1 << 14,
    name: 'bug_hunter'
  },
  {
    flag: 1 << 17,
    name: 'bot_developer'
  }

]

module.exports = class ProfileCommand extends Command {
  constructor() {
    super({
      name: 'profile',
      aliases: ['perfil'],
      hasUsage: true,
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('profile')
        .setDescription('Shows your social profile or the social profile of someone.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention member on server.')
        )
    })
  }

  async run(ctx) {
    // Slash disabled command
    return ctx.replyT('mitsy_what', 'commands:disabled.slashDisabled', {0: `${ctx.db.guild.prefix}profile`})

    const user1 = ctx.args.get('user')?.value
    const member = await ctx.getUser(user1?.id ?? ctx.message.author.id, true)
    const user = await ctx.client.database.users.getOrCreate(member.id)
    const couple = user.isMarry ? await ctx.getUser(user.marryWith) : { username: '', discriminator: '' }

    const arrayBadges = []

    for (const flag of flags) {
      switch ((flag.flag & member.publicFlags) === flag.flag) {
        case true:
          arrayBadges.push(flag.name)
          break
        case false:
          /**
          *@returns null
          */
        
        default:
          /**
          *@returns null
          */
      }
    }

    const guildMember = await ctx.message.guild.members.get(member.id)

    axios({
      url: 'http://185.106.96.238:1234/render/profile',
      method: 'post',
      data: {
        type: user.profileType,
        name: member.username,
        money: Number(user.comets).toLocaleString(),
        aboutMe: user.aboutme !== 'default' ? user.aboutme : ctx._locale('commands:profile.defaultAboutMe', { 0: ctx.db.guild.prefix }),
        married: user.isMarry,
        partnerName: `${couple?.username}#${couple.discriminator}`,
        bgId: user.background,
        stickerId: user.sticker,
        favColor: user.profileColor,
        avatarUrl: guildMember?.guildAvatar,
        badges: arrayBadges
      },
      responseType: 'arraybuffer'
    }).then(profile => {
      ctx.send('', {
        file: {
          file: profile.data,
          name: 'profile.png'
        }
      })
    })
  }
}