const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-account')
        .setDescription('retrieves your account information'),
    async execute(interaction, auth, { Accounts }) {

        // Retrieve info from database
        const accountInfo = await Accounts.findOne( { where: { accountId: auth.userAccount } } )
        if (!accountInfo) {
            return interaction.reply("There is no account information associated with your roles.");
        }
        const {name, isBanned, balance} = accountInfo;

        // Return information to user
        if (isBanned) {
            return interaction.reply("Your account has been terminated by the Bank for breach of contract.  Have a nice day!");
        } else {
            interaction.reply(`Account information for **${name}**:\n\nYour account is in good standing.  Your balance is: **${balance}**`);
        }


    }
}