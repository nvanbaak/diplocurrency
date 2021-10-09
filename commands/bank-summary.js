const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank-summary')
        .setDescription('BANKER ONLY: displays all account information'),
    async execute( commandInfo ) {

        const {
            interaction,
            auth,
            db: { Accounts }
        } = commandInfo;

        // Make sure the user is authorized
        if (!auth.isAdmin && !auth.isBank) {
            return await interaction.reply("You're not authorized to view that account.")
        }

        const allAccounts = await Accounts.findAll();

        let outputStr = "Account summary:\n"

        for (const account of allAccounts) {

            if (account.isBanned) {
                outputStr += `\n• **${account.name}**: banned`;
            } else if (account.isBank) {
                outputStr += `\n• **${account.name}** (The Bank): **∞**`;
            } else {
                outputStr += `\n• **${account.name}**: ${account.balance}`;
            }
        }

        return interaction.reply(outputStr);

    }
}