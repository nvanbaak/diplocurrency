const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token, adminId, bankId, ledgerId } = require('./config.json');
const Sequelize = require('sequelize');


// load commands to the API
const refreshCommands = require('./deploy-commands.js');
refreshCommands();


// Start Client
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


// Define account array
const accountIds = [];


// set up client once ready
client.once('ready', async ()=> {
    console.log('Client is ready.');

    // sync database
    const syncSettings = {force : false} // 'true' resets database each time the bot starts; 'false' makes it persistant
    db.Accounts.sequelize.sync( syncSettings );
    db.Transactions.sequelize.sync( syncSettings );

    console.log('Database synced.');

    // get list of account ids from database
    try {
        const accountInfo = await db.Accounts.findAll();
        for (const account of accountInfo) {
            accountIds.push(account.accountId);
        }
    } catch (err) {
        console.log("No account information found — use /account-setup and then restart the bot.")
    }
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
    const userAccounts = interaction.member._roles;
    let userAccount;

    // Because of how the API returns member roles, we basically just have to see if the role we're looking for is in the account information
    for (const id of accountIds) {
        if ( userAccounts.includes(id) ) {
            userAccount = id;
            break;
        }
    }

    const auth = {
        isAdmin : isAdmin,
        isBank : isBank,
        userAccount : userAccount
    };

    const commandInfo = {
        interaction: interaction,
        auth: auth,
        db: db,
        ledgerId: ledgerId 
    }

    try {
        await command.execute(commandInfo);
    } catch (error) {
        console.error(error);
        await interaction.reply( {content: "command failed", ephemeral: true});
    }
});

client.login(token);