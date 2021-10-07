const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank-summary')
        .setDescription('BANKER ONLY: displays all account information'),
    async execute(interaction, auth, { Accounts }) {

        // Make sure the user is authorized
        if (!auth.isAdmin && !auth.isBank) {
            return await interaction.reply("You're not authorized to view that account.")
        }

        const {name, isBanned, balance} = await Accounts.findOne( { where: { accountId: targetAccountId} } )

    }
}