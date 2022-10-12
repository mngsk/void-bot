const { SlashCommandBuilder } = require("discord.js");
const { addPackage } = require("../database.js");
const { formatPackages } = require("../utils/packages.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watch")
    .setDescription("Add the specified package to your watch list.")
    .addStringOption((option) =>
      option
        .setName("package")
        .setDescription("Name of the package to watch")
        .setRequired(true)
    ),

  async execute(interaction) {
    const _package = interaction.options.getString("package");

    if (!_package || _package.length <= 0) {
      return interaction.reply({
        content: "You need to input a package name",
        ephemeral: true,
      });
    }

    const userId = interaction.user.id;

    try {
      const packages = await addPackage(userId, _package);

      const content = formatPackages(packages);

      await interaction.reply({ content, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: error.message, ephemeral: true });
    }
  },
};
