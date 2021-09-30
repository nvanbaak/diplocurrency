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
            option.setName('reason-for-transaction')
            .setDescription("why you're paying; used by banker to determine deal violations")
            .setRequired(true)),
    async execute(interaction, auth) {

        console.log(auth); 

        // const userCountry = interaction.member._roles[1]

        // console.log(interaction.member);
        // console.log("---------------------------------------------------");
        // console.log(interaction.options);
        // console.log("---------------------------------------------------");
        // console.log(interaction.options._hoistedOptions[0].role);
        interaction.reply("Printed to console!");

    }
}