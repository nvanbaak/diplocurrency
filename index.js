const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token, adminId, bankId } = require('./config.json');

const refreshCommands = require('./deploy-commands.js');
refreshCommands();

const client = new Client( {intents: [Intents.FLAGS.GUILDS]} );

// grabs all commands from ./commands and makes it available to the bot.
// adapted from https://discord.js/creating-your-bot/command-handling.html

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// read account data from file
let accountInfo;
fs.readFile('accounts.json', function(err, data) {
    accountInfo = JSON.parse(data);
    console.log("Loaded account information.");
});

// setup client
client.once('ready', ()=> {
    console.log('Client is ready.');
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    // get command and return if it's not in the list
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // get user information for auth purposes
    const isAdmin = ( interaction.user.id == adminId );
    const isBank = ( interaction.member._roles.includes(bankId));
    const userAccount = accountInfo[interaction.member._roles[1]]; // role 0 is player, role 1 is country

    const auth = {
        isAdmin : isAdmin,
        isBank : isBank,
        userAccount : userAccount
    };

    console.log(auth);

    try {
        await command.execute(interaction, auth, accountInfo);
    } catch (error) {
        console.error(error);
        await interaction.reply( {content: "command failed", ephemeral: true});
    }
});

client.login(token);