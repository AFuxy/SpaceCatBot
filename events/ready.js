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
        //send message to suggestion channel using the config suggestionMessageId
        // const suggestionChannel = client.channels.cache.get(config.suggestionChannelId);
        // suggestionChannel.send({ content: "Since Jonesy gets games suggested to her all the time, in the YT comments, on Twitch, and in the server, we've decided to get a list going.\n\nA few things to mention up top:\n\nFirstly, a game being on this list is NOT any guarantee it will be played. Jonesy gets to decide, not any of us.\nSecondly, this list is in no particular order, so no reading into anything.\nFinally, think about what sort of games Jonesy actually plays, either for content or in her own time, when making suggestions.\n\nUse the new `/recommend` command (anything else will be ignored)." });

        index.updateList();
    },
};