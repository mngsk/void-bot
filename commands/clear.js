const { SlashCommandBuilder } = require("discord.js");
const { clearPackages } = require("../database.js");
const { formatPackages } = require("../utils/packages.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear your watchlist."),

  async execute(interaction) {
    const userId = interaction.user.id;

    try {
      const packages = await clearPackages(userId);

      const content = formatPackages(packages);

      await interaction.reply({ content, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: error.message, ephemeral: true });
    }
  },
};
