const { SlashCommandBuilder } = require("discord.js");
const { getPackages } = require("../database.js");
const { formatPackages } = require("../utils/packages.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("List the packages you're watching."),

  async execute(interaction) {
    const userId = interaction.user.id;

    try {
      const packages = await getPackages(userId);

      const content = formatPackages(packages);

      await interaction.reply({ content, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: error.message, ephemeral: true });
    }
  },
};
