const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hi!'),
    async execute(interaction, auth) {
        await interaction.reply("Hi there!");
    }
}