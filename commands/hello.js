const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hi!'),
    async execute(interaction, auth, accountInfo) {
        await interaction.reply("Hi there!");
    }
}