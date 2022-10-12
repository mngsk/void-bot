module.exports = {
  formatPackages(packages) {
    if (!packages || packages.length === 0) {
      return "[empty]";
    } else {
      return packages.map((p) => `- ${p}`).join("\n");
    }
  },
};
