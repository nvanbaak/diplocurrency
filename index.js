const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client( {intents: [Intents.FLAGS.GUILDS]} );

client.once('ready', ()=> {
    console.log('Client is ready.');
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;

    console.log("GuildID: \n")

});

client.login(token);