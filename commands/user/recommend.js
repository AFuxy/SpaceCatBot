const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const config = require('../../config.json');
const index = require('../../index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recommend')
        .setDescription('Recommend a game for Jonesy to play.')
        .addStringOption(option =>
            option
                .setName('game')
                .setDescription('Game Title')
                .setRequired(true)
        ),
    async execute(interaction) {
        const recommend = interaction.options.getString('game');
        const data = fs.readFileSync('./suggestions.json', 'utf8');
        const suggestions = JSON.parse(data);

        //check if game has been recommended before in suggestions.json
        //lowercase the game name to make sure there is no duplicates
        if(suggestions[recommend.toLowerCase()]) {
            if(suggestions[recommend.toLowerCase()].status == "approved"){
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Sorry!')
                    .setDescription('Seems this game has already been approved.\nIt has probably been played already or is in the works.')
                    .setTimestamp()
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }else if(suggestions[recommend.toLowerCase()].status == "denied"){
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Sorry!')
                    .setDescription('Seems this game has already been denied.\nSadly this means the game will not be played.')
                    .setTimestamp()
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }else if(suggestions[recommend.toLowerCase()].hide == true){
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Sorry!')
                    .setDescription('This game has been hidden from the list.')
                    .setTimestamp()
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Sorry!')
            .setDescription('This game has been recommended already.')
            .setTimestamp()
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }else{
            try {
                //update the suggestions.json with the game and the user who suggested it in the style
                // {"GameName":{"userid": "userid", "status": null}}
                suggestions[recommend.toLowerCase()] = { userid: interaction.user.id, status: null, date: new Date(), hide: false };
                fs.writeFileSync('./suggestions.json', JSON.stringify(suggestions));
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('Success!')
                    .setDescription('Thank you for recommending ' + recommend.toLowerCase())
                    .setTimestamp()

                await interaction.reply({ embeds: [embed], ephemeral: true });

                // let suggestionUpdate = suggestions[recommend] = interaction.user.id;
                // fs.writeFileSync('./suggestions.json', JSON.stringify(suggestions));
                // const embed = new EmbedBuilder()
                //     .setColor(0x00FF00)
                //     .setTitle('Success!')
                //     .setDescription('Thank you for recommending ' + recommend)
                //     .setTimestamp()

                // await interaction.reply({ embeds: [embed], ephemeral: true });
                index.updateList();
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Failed to add the recommendation, maybe try again? or report the issue to an admin:- ErrorID: RE003', ephemeral: true });
            }
        }
    }
}