const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const config = require('../../config.json');
const index = require('../../index.js');
const list = require('../../suggestions.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hide')
        .setDescription('Hide\'s a game from the suggestions list.')
        .addStringOption(option =>
            option
                .setName('game')
                .setDescription('Game Title')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addBooleanOption(option =>
            option
                .setName('hide')
                .setDescription('true to hide the game from the list, false to unhide it.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        const games = Object.keys(list);

        const filteredChoices = games.filter((game) => 
            // game.toLowerCase().startsWith(focusedValue.toLowerCase())
            game.toLowerCase().includes(focusedValue.toLowerCase())
        ).slice(0, 25);

        const results = filteredChoices.map((choice) => {
            return {
                name: `${choice} - ${list[choice].status}`,
                value: choice
            }
        });

        await interaction.respond(results).catch(() => {});
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('You do not have permission to use this command.')
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const game = interaction.options.getString('game');
        const hide = interaction.options.getBoolean('hide');
        const data = fs.readFileSync('./suggestions.json', 'utf8');
        const suggestions = JSON.parse(data);
        if (suggestions[game.toLowerCase()]) {
            suggestions[game.toLowerCase()].hide = hide;
            fs.writeFileSync('./suggestions.json', JSON.stringify(suggestions));
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Success!')
                .setDescription('The game has been ' + (hide ? 'hidden' : 'unhidden') + ' from the list.')
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
            index.updateList();
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('That game is not in the list.')
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}