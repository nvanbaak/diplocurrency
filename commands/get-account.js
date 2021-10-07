const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('view-account')
        .setDescription('gets account information')
        .addRoleOption(option => 
            option.setName('country')
                .setDescription('the country whose information you want to view')
                .setRequired(true)),
    async execute(interaction, auth, { Accounts }) {

        const targetAccountId = interaction.options._hoistedOptions[0].value;

        // Make sure the user is authorized to view this account
        if (!auth.isAdmin && !auth.isBank) {
            if (targetAccount != auth.userAccount) {
                return await interaction.reply("You're not authorized to view that account.")
            }
        }

        const {name, isBanned, balance} = await Accounts.findOne( { where: { accountId: targetAccountId} } )

        if (isBanned) {
            return interaction.reply("Your account has been terminated by the Bank for breach of contract.  Have a nice day!");
        } else {
            interaction.reply(`Account information for **${name}**:\n\nYour account is in good standing.  Your balance is: **${balance}**`);
        }


    }
}