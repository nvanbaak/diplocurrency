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
    async execute( { interaction, auth, db } ) {

        if (!auth.isAdmin) {
            return await interaction.reply("You're not authorized to set up bank accounts.")
        } else {

            const countryRoles = interaction.options._hoistedOptions;

            for (country of countryRoles) {
                try {
                    const account = await db.Accounts.create({
                        name : country.role.name,
                        accountId : country.role.id,
                        isBank : false,
                        isBanned : false,
                        balance : 2
                    });
                } catch (err) {
                    return interaction.reply('Error creating account');
                }
            }

            await interaction.reply("Linked accounts to roles.");
        }

    }
}