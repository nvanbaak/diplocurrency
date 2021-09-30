const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account-setup')
        .setDescription('defines account settings')
        .addRoleOption(option => 
            option.setName("austria").setDescription("austria").setRequired(true))
        .addRoleOption(option => 
            option.setName("england").setDescription("england").setRequired(true))
        .addRoleOption(option => 
            option.setName("france").setDescription("france").setRequired(true))
        .addRoleOption(option => 
            option.setName("germany").setDescription("germany").setRequired(true))
        .addRoleOption(option => 
            option.setName("italy").setDescription("italy").setRequired(true))
        .addRoleOption(option => 
            option.setName("russia").setDescription("russia").setRequired(true))
        .addRoleOption(option => 
            option.setName("turkey").setDescription("turkey").setRequired(true)),
    async execute(interaction, auth) {

        if (!auth.isAdmin) {
            await interaction.reply("You're not authorized to set up bank accounts.")
        } else {

            const countryRoles = interaction.options._hoistedOptions;
            const bankAccounts = {};

            for (country of countryRoles) {
                const bankProfile = {
                    name : country.role.name,
                    id : country.role.id,
                    isBank : false,
                    banned : false,
                    balance : 2
                }
                bankAccounts[bankProfile.id] = bankProfile;
            }

            const output = JSON.stringify(bankAccounts);

            fs.writeFileSync("accounts.json", output, 'utf8', function (err) {
                if (err) {
                    console.log("Write to file failed.");
                    console.log(err);
                    return;
                }
            })

            await interaction.reply("Linked accounts to roles.  Restart the bot for changes to take effect.");
        }

    }
}