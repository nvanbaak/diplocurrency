const { SlashCommandBuilder } = require('@discordjs/builders');
const account = require('../models/account');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban a country from the Voracoin market')
        .addRoleOption(option => 
            option.setName('country')
                .setDescription('the country to ban')
                .setRequired(true)),
    async execute( commandInfo ) {

        const {
            interaction,
            auth,
            db: { Accounts }
        } = commandInfo;

        // reprimand non-admin users for their hubris
        if (!auth.isAdmin && !auth.isBank) {
            return interaction.reply( {content: "You're not authorized to use this command.", ephemeral: true} );
        }

        const targetAccountId = interaction.options._hoistedOptions[0].value;
        const targetAccountName = interaction.options._hoistedOptions[0].name;

        const accountUpdate = await Accounts.update( {isBanned: true, balance: 0 }, { where: {accountId: targetAccountId} } );

        return interaction.reply(`Banned ${targetAccountName} from the market!`);
    }
}