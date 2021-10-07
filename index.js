const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token, adminId, bankId } = require('./config.json');
const Sequelize = require('sequelize');

const refreshCommands = require('./deploy-commands.js');
refreshCommands();

const client = new Client( {intents: [Intents.FLAGS.GUILDS]} );

// grabs all commands from ./commands and makes it available to the bot.
// code from https://discord.js/creating-your-bot/command-handling.html

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// database setup
const sequelize = new Sequelize('database', 'user', 'password', {
    host : 'localhost',
    dialect : 'sqlite',
    logging : false,
    storage : 'database.sqlite'
});

// load db models; we'll sync them once the bot's ready
const makeDb = require("./models/index.js");
const db = makeDb(sequelize, Sequelize.DataTypes);

// setup client
client.once('ready', ()=> {
    console.log('Client is ready.');

    // sync database
    const syncSettings = {force : true} // resets database each time the bot starts; 'false' makes it persistant
    db.account.sequelize.sync( syncSettings );
    db.transaction.sequelize.sync( syncSettings );

    console.log('Database synced.');
});

// bot responses
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

    try {
        await command.execute(interaction, auth, db);
    } catch (error) {
        console.error(error);
        await interaction.reply( {content: "command failed", ephemeral: true});
    }
});

client.login(token);