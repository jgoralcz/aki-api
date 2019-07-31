const Discord = require('discord.js');
const aki = require('aki-api');

/**
 * module for Aki. Testing it out.
 * @type {{name: string, description: string, cooldown: number, guildOnly: boolean, run(*, *, *, *): Promise<Promise<Message|Message[]>|*>, help: (function(): string)}}
 */
module.exports = {
  name: 'aki',
  description: 'aki.',
  aliases: ['akinator'],
  cooldown: 25,
  type: 'other',
  guildOnly: true,
  users: new Set(),

  regions: ['en', 'en2', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr'],
  maxSteps: 80,

  yes: '✅',
  no: '❌',
  unknown: '❓',
  probably: '🤔',
  probablyNot: '🚫',
  back: '⬅',
  stop: '🛑',


  /**
     * run for aki command
     * @param bot the client
     * @param prefix the prefix of the user
     * @param message the message sent by the user
     * @param args the arguments from the user
     * @returns {Promise<Promise<Message|Message[]>|*>}
     */
  async run(bot, prefix, message, args) {
    if (args.length >= 1 && args[0].toLowerCase() === 'help') {
      return await message.channel.send(await this.help(bot, prefix, message, args));
    }

    if (this.users.has(message.author.id)) {
      return await message.channel.send(`\`❌\` | You already have a session started. Please hit the ${this.stop} emoji to end.`);
    }

    // check permissions
    const reactPermissions = message.guild.me.hasPermission(['ADD_REACTIONS', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'])
        && message.channel.permissionsFor(message.guild.me).has(['ADD_REACTIONS', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY']);

    if (!reactPermissions) {
      return await message.channel.send('`❌` | I need reaction permissions, embed permissions, and read message history permissions.');
    }

    // get region if it exists
    let region = 'en';
    if (args.length >= 1) {
      const testRegion = args[0];
      const i = this.regions.findIndex(reg => testRegion === reg);

      if (i !== -1) {
        region = this.regions[i];
      }
    }


    // should probably fix this nesting
    let info = await aki.start(region).catch(console.error);
    if (!info) {
      region = 'en2';
      info = await aki.start(region).catch(console.error);
      if (!info) {
        region = 'en3';
        info = await aki.start(region).catch(console.error);

        // if still no info, then we have no info.
        if (!info) {
          return await message.channel.send('Aki servers are down :(\nPlease check back later.');
        }
      }
    }

    // variables to further help
    let loop = 0; let
      found = false;
    const str = `${this.yes}: **Yes** **|** ${this.no}: **No** **|** ${this.unknown} **I don't know**\n\n`
            + `${this.probably}: **Probably** **|** ${this.probablyNot}: **Probably Not**\n\n`
            + `${this.back}: **Back** **|** ${this.stop}: **Stop**`;

    let nextInfo = {};
    nextInfo.nextQuestion = str;

    // make the new embed to send
    const embed = new Discord.RichEmbed()
      .setTitle(`Question 1: ${info.question}`)
      .setDescription(nextInfo.nextQuestion)
      .setColor('GOLD')
      .setFooter('Please answer within 60 seconds.');

    let myMessage = await message.channel.send(embed);

    await myMessage.react(this.yes);
    await myMessage.react(this.no);
    await myMessage.react(this.unknown);
    await myMessage.react(this.probably);
    await myMessage.react(this.probablyNot);
    await myMessage.react(this.back);
    await myMessage.react(this.stop);

    // create my filter
    const author = message.author.id;
    const filter = (reaction, user) => ([this.yes, this.no, this.unknown, this.probably, this.probablyNot, this.back, this.stop].includes(reaction.emoji.name))
            && user.id === author && !user.bot;

    // new reaction collector
    const collector = myMessage.createReactionCollector(filter);


    // add the user to the set so they can only have 1 session
    this.users.add(message.author.id);

    // refresh timer each message
    const timeout = setTimeout(() => {
      if (collector != null && collector.emit) {
        collector.emit('end');
      }
    }, 6e4);

    // reaction collector functions
    const collectorFunction = async (r, collector) => {
      // timeout to stop the collector (1 minute for each message)
      timeout.refresh();

      // after 1 second allow them to react
      setTimeout(async () => {
        let answerID;
        switch (r.emoji.name) {
          case this.yes:
            answerID = 0;
            break;
          case this.no:
            answerID = 1;
            break;
          case this.unknown:
            answerID = 2;
            break;
          case this.probably:
            answerID = 3;
            break;
          case this.probablyNot:
            answerID = 4;
            break;
          case this.back:
            answerID = 5;
            break;
          case this.stop:
            answerID = 6;
            break;
        }

        // back
        if (answerID === 5) {
          if (nextInfo.nextStep > 0) {
            nextInfo = await aki.back(region, info.session, info.signature, answerID, nextInfo.nextStep || 0);
          }
        }
        // stop
        else if (answerID === 6) {
          if (collector != null && collector.emit) {
            collector.emit('end');
          }
          return;
        } else if (answerID != null) {
          // found
          if (found) {
            // we had the right answer
            if (answerID === 0) {
              // send message
              myMessage = await bot.editMessage(myMessage, `Looks like I win again! This time after ${nextInfo.nextStep} steps. Thanks for playing!`, { embed });

              if (collector != null && collector.emit) {
                collector.emit('end');
              }

              return;
            }
            // wrong answer
            if (answerID === 1) {
            }
            found = false; // not found, time to reset on our side
          }
          nextInfo = await aki.step(region, info.session, info.signature, answerID, nextInfo.nextStep || 0);
        }

        // now that we have our new info, we must decide whether to end the game (they won) or continue
        // they won
        if (nextInfo.progress >= 78 && loop > 3 || nextInfo.nextStep >= 79) {
          // reset loop to ensure we are not getting the same answer (we have to keep trying)
          loop = 0;

          // try to win, error either goes again or ends
          const win = await aki.win(region, info.session, info.signature, nextInfo.nextStep || 0).catch(async (error) => {
            console.error(error);

            // can continue (max of 80 steps)
            if (nextInfo.nextStep < this.maxSteps) {
              nextInfo = await aki.step(region, info.session, info.signature, answerID, nextInfo.nextStep || 0);
            } else {
              myMessage = await bot.editMessage(myMessage, 'Akinator error has occurred.', { embed: null });
              if (collector != null && collector.emit) {
                collector.emit('end');
              }
            }
          });

          // found some answers
          if (win.answers != null && win.answers.length > 0) {
            found = true;
            const { name } = win.answers[0];
            const image = win.answers[0].absolute_picture_path;
            const description = win.answers[0].description || '';

            if (nextInfo.nextStep >= 79) {
              embed.setTitle('My Final Guess is... 🤔');
            } else {
              embed.setTitle('I\'m thinking of... 🤔');
            }

            // add description and image
            embed.setDescription(`**${name}**\n**${description}**\n${str}`);
            if (image != null) {
              embed.setImage(image);
            }

            myMessage = await bot.editMessage(myMessage, '', { embed });

            // done with the game, we can't do anything else.
            if (nextInfo.nextStep >= 79) {
              if (collector != null && collector.emit) {
                collector.emit('end');
              }
            }
          }
        }
        // keep going (didn't win or get close yet)
        else {
          loop++;
          embed.setTitle(`Question ${nextInfo.nextStep + 1}: ${nextInfo.nextQuestion}`)
            .setDescription(str)
            .setImage(undefined);
          myMessage = await bot.editMessage(myMessage, '', { embed });
        }
      }, 1000);
    };

    // assign the function
    collector.on('collect', collectorFunction);

    collector.on('end', (collected, reason) => {
      // remove the user from the set
      this.users.delete(message.author.id);
      if (myMessage != null && !myMessage.deleted) {
        myMessage.clearReactions().catch(console.error);
      }
    });
  },

  /**
     * shows help info.
     * @param bot the discord bot.
     * @param prefix the user's prefix.
     * @param message the discord message.
     * @param args the arguments parsed from the message.
     * @returns {Promise<{embed: *}>}
     */
  async help(bot, prefix, message, args) {
    const helpEmbed = new Discord.RichEmbed()
      .setTitle('Akinator')
      .setDescription('• Can I guess it?\n• Supports up to 15 languages!')
      .addField('❯ Usage', `\`${prefix}aki [region]\``)
      .addField('❯ Examples',
        `\`${prefix}aki fr\`
                \`${prefix}aki\``)
      .addField('❯ Regions', '`[en, en2, en3, ar, cn, de, es, fr, il, it, jp, kr, nl, pl, pt, ru, tr]`')
      .addField('❯ Aliases', '`akinator`')
      .setColor('PURPLE')
      .setFooter('It\'s magic. Trust me. ');

    return { embed: helpEmbed };
  },
};
