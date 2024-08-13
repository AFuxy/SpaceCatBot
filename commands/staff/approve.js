const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const config = require('../../config.json');
const index = require('../../index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('approve')
        .setDescription('Set a game as "approved".')
        .addStringOption(option =>
            option
                .setName('game')
                .setDescription('Game Title')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
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
        const data = fs.readFileSync('./suggestions.json', 'utf8');
        const suggestions = JSON.parse(data);
        if (suggestions[game.toLowerCase()]) {
            suggestions[game.toLowerCase()].status = "approved";
            fs.writeFileSync('./suggestions.json', JSON.stringify(suggestions));
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Success!')
                .setDescription('The game has been approved.')
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