const { Events, ActivityType } = require('discord.js');
//get function from index file
const config = require('../config.json');
const index = require('../index.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setPresence({ activities: [{ name: 'Watching Space', type: ActivityType.Custom }], status: "online" })
        index.updateList();
    },
};