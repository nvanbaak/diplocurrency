const { SlashCommandBuilder } = require('@discordjs/builders');
const transaction = require('../models/transaction');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('transfer voracoin to another account')
        .addRoleOption(option => 
            option.setName('country')
                .setDescription('the country you want to pay')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('the amount to pay')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('reason-for-transaction')
            .setDescription("why you're paying; used by banker to determine deal violations")
            .setRequired(true)),
    async execute( { interaction, auth, db: { Accounts, Transactions } } ) {

        // extract options from command
        const targetId = interaction.options.getRole("country").id;
        const transferAmount = interaction.options.getInteger("amount");
        const reason = interaction.options.getString("reason-for-transaction");

        // get account information for both countries
        const userAccount = await Accounts.findOne( { where: {accountId: auth.userAccount}});
        const targetAccount = await Accounts.findOne( { where: {accountId: targetId}});


        // Send an error message if the receiver is banned
        if (targetAccount.isBanned) {
            return await interaction.reply("You cannot complete this transaction because the recipient has been banned from the market.")
        }

        // Send an error message if the sender is banned
        if (userAccount.isBanned) {
            return await interaction.reply("You cannot complete this transaction because you have been banned from the market.")
        }

        // Send an error message for transfer amounts that aren't positve integers
        if (transferAmount < 1) {
            return await interaction.reply("You can't make payments of 0 or negative amounts.  Nice try.")
        }

        // Send an error message if they don't have enough money
        if (userAccount.balance < transferAmount) {
            return await interaction.reply( {content: `You don't have enough money to make that payment. (Balance: ${userAccount.balance}; attempted transfer: ${transferAmount})`, ephemeral: true})
        }


        // Create transaction record
        const transactionInfo = {
            senderId: userAccount.accountId,
            receiverId: targetAccount.accountId,
            amount: transferAmount,
            reason: reason
        }
        try {
            const receipt = Transactions.create(transactionInfo);
        } catch (err) {
            return await interaction.reply("Error creating transaction object.")
        }


        // Update user account information
        const newUserBalance = userAccount.balance - transferAmount;
        const userUpdate = await Accounts.update( {balance: newUserBalance}, {where: {accountId: userAccount.accountId}});

        // Update target account information
        const newTargetBalance = targetAccount.balance + transferAmount;
        const accountUpdate = await Accounts.update( {balance: newTargetBalance}, {where: {accountId: targetAccount.accountId}});
        
        // Tell user the update succeeded
        if (accountUpdate) {
            await interaction.reply(`${targetAccount.name} has been paid ${transferAmount} VC.`)
        }

        interaction.reply("Printed to console!");
    }
}