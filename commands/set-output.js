const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteractionOptionResolver } = require('discord.js');
const transaction = require('../models/transaction');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-output')
        .setDescription('tell the bot to output in this channel')
        .addRoleOption(option => 
            option.setName('country')
                .setDescription('ADMIN ONLY: which country to set output')
                .setRequired(false)),
    async execute( commandInfo ) {

        const {
            interaction,
            auth:{isAdmin, userAccount},
            db:{Accounts}
        } = commandInfo;
        
        // When admin uses the command, it sets the output of the designated country
        if (isAdmin) {
            const countryId = interaction.options.getRole("country").id;
            const channel = interaction.channelId;

            if (!countryId) {
                return interaction.reply( {content: "You need to designate a country for this to work."}, {ephemeral: true})
            }

            const accountInfo = await Accounts.findOne( {where: {accountId: countryId}});

            const accountUpdate = await Accounts.update( {outputChannel: channel}, {where: {accountId: countryId}} )

            return interaction.reply(`Set bot notifications for country **${accountInfo.name}** to this channel`);
        } 
        
        // if not an admin, it just changes the user's country
        else {
            const accountUpdate = await Accounts.update( { where: { accountId: userAccount } } )
            if (!accountUpdate) {
                return interaction.reply("There is no account information associated with your roles.");
            }

            const accountInfo = await Accounts.findOne( {where: {accountId: countryId}});

            return interaction.reply(`Set bot notifications for country **${accountInfo.name}** to this channel`);
        }

    }
}