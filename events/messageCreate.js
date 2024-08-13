const { Events, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const config = require('../config.json');
const index = require('../index.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,

    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.id === config.suggestionChannelId) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('Error')
                .setDescription('Hey, <@'+message.author.id+'>\nit seems like you might be trying to make a recommendation.\nPlease use the `/recommend` command instead.\n\nIf you want to add any other comments, you can discuss the list in <#869527125764481085>')
                .setTimestamp();
            message.channel.send({ embeds: [errorEmbed], ephemeral: true }).then(async errorMessage => {
                await wait(25_000);
                errorMessage.delete();
            })
            message.delete();
        }
    }
}