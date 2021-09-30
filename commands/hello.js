const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('Hello')
        .setDescription('Says hi!'),
    async executionAsyncResource(interaction) {
        await interaction.reply("Hi there!");
    }
}