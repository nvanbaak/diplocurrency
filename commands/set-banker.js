const { SlashCommandBuilder } = require('@discordjs/builders');
const account = require('../models/account');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-as-bank')
        .setDescription('designate a country as the Bank')
        .addRoleOption(option => 
            option.setName('country')
                .setDescription('the country to designate')
                .setRequired(true)),
    async execute( commandInfo ) {

        const {
            interaction,
            auth,
            db:{ Accounts }
        } = commandInfo;

        // reprimand non-admin users for their hubris
        if (!auth.isAdmin) {
            return interaction.reply( {content: "You're not authorized to use this command.", ephemeral: true} );
        }

        const targetAccountId = interaction.options._hoistedOptions[0].value;
        const targetAccountName = interaction.options._hoistedOptions[0].name;

        const accountUpdate = await Accounts.update( {isBank: true, balance: 10000 }, { where: {accountId: targetAccountId} } );

        return interaction.reply(`Set ${targetAccountName} as banker!`);
    }
}