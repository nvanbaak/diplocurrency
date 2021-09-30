const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('transfer voracoin to another account')
        .addRoleOption(option => 
            option.setName('country')
                .setDescription('the country you want to pay')
                .setRequired(true)
                )
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('the amount to pay')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('deal')
            .setDescription("the reason you're making the transaction")
            .setRequired(true)),
    async execute(interaction) {

        console.log(interaction);
        console.log("---------------------------------------------------");
        console.log(interaction.options);
        console.log("---------------------------------------------------");
        console.log(interaction.options._hoistedOptions[0].role);
        interaction.reply("Printed to console!");

    }
}