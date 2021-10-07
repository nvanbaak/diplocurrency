const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-account')
        .setDescription('gets account information')
        .addRoleOption(option => 
            option.setName('country')
                .setDescription('the country you want to pay')
                .setRequired(true))
,
    async execute(interaction, auth, { Accounts }) {

        const targetAccountId = interaction.options._hoistedOptions[0].value;

        // Make sure the user is authorized to view this account
        if (!auth.isAdmin && !auth.isBank) {
            if (targetAccount != auth.userAccount) {
                return await interaction.reply("You're not authorized to view that account.")
            }
        }

        const { dataValues } = await Accounts.findOne( { where: { accountId: targetAccountId} } )

        console.log(dataValues)

        interaction.reply(`Account information for **${dataValues.name}**:\n\nYour balance is **${dataValues.balance}**`);

    }
}