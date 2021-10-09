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
    async execute( commandInfo ) {

        const {
            interaction,
            auth,
            db: { Accounts, Transactions },
            ledgerId
        } = commandInfo;

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

        // Send confirmation message to recipient
        const myGuild = interaction.guild;

        if (targetAccount.outputChannel) { // skip if no output channel
    
            const receiverChannel = await myGuild.channels.fetch(targetAccount.outputChannel);

            // At one point, the send command only worked here if you printed the channel to console first.  I have no idea why.  It has since stopped failing this way for no apparent reason.
            // console.log(receiverChannel)
    
            if (receiverChannel) {
                await receiverChannel.send(`Good day!  You have received **${transferAmount} VC** from **${userAccount.name}** for reason "${reason}".\n\n*The details of this transaction have been automatically entered into the Bank of Vora ledger.  As of this message, you are considered bound to these terms by the Bank of Vora.  Failure to comply with these terms will result in ejection from the Voracoin market.  If you believe this transaction was in error or wish to challenge the terms of the deal, you can make an appeal to the Bank of Vora via their diplomatic channels.*` );
            }
        }

        // Record transaction in ledger
        const ledgerChannel = await myGuild.channels.fetch(ledgerId);

        // At one point, the send command only worked here if you printed the channel to console first.  I have no idea why.  It has since stopped failing this way for no apparent reason.
        // console.log(ledgerChannel)

        if (ledgerChannel) {
            await ledgerChannel.send(`\`\`\`AUTOMATIC TRANSACTION NOTIFICATION\n\n${userAccount.name} paid ${transferAmount} VC to ${targetAccount.name}.\nReason for payment: ${reason}\n\nNew balance for ${userAccount.name}: ${userAccount.balance} VC\nNew balance for ${targetAccount.name}: ${targetAccount.balance} VC\`\`\``)
        }

        // Tell user the update succeeded
        if (accountUpdate) {
            return await interaction.reply(`You have paid ${targetAccount.name} ${transferAmount} VC.`)
        } else {
            return await interaction.reply("Something went wrong with payment.  Please ping your administrator.")
        }
    }
}