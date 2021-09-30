// this code taken, with modifications, from https://discordjs.guide/creating-your-bot/creating-commands.html#command-deployment-script

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('hello').setDescription('Hi there!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info.'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info.'),
    new SlashCommandBuilder().setName('transfer').setDescription('Transfers payment between users.'),
    new SlashCommandBuilder().setName('balance').setDescription('Displays account balance.')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);