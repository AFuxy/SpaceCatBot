const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, Message } = require('discord.js');
const config = require('./config.json');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    updateList: async function() {
        const suggestionMessageId = config.suggestionMessageId;
        const suggestionChannelId = config.suggestionChannelId;
        // get the list of games from suggestions.json
        let data = fs.readFileSync('./suggestions.json', 'utf8');
        data = JSON.parse(data);
    

        // create an array of the game names then add the username of the user who suggested the game
        // then join the array into a string
        let games = [];
        for (const game in data) {
            var gameUser;
            var gameStatus;
            

            if(data[game].userid == null){
                // gameUser = " - `Anonymous`";
                gameUser = "";
            }else{
                gameUser = await client.users.fetch(data[game].userid);
                gameUser = " - `" + gameUser.username + "`";
            }

            //get the status of the game
            if(data[game].status == "denied"){
                gameStatus = " - <:cross:1271541395097911296>";
            }else if(data[game].status == "approved"){
                gameStatus = " - <:tick:1271541421479821412>";
            }else{
                // gameStatus = " - Pending";
                gameStatus = "";
            }
            //add the game name and username to the array
            games.push(`1. ${game}${gameUser}${gameStatus}`);
        }

        //without usernames
        // let games = [];
        // for (const game in data) {
        //     games.push(game);
        // }
    
        // sort the array alphabetically
        games.sort();
    
        // join the array into a string
        data = games.join('\n');
    
        const suggestionEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Suggestion')
            .setDescription('Suggested games: \n' + data);
        client.channels.cache.get(suggestionChannelId).messages.fetch(suggestionMessageId).then(message => {
            const suggestionMessage = message;
            if (!suggestionMessage) {
                console.error("Suggestion message not found");
                return;
            }

            suggestionMessage.edit({ embeds: [suggestionEmbed] });
        })
    }
}


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);