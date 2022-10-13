const fs = require("node:fs/promises");
const path = require("node:path");
const { dataDir } = require("./config.json");

async function loadData() {
  const dataFile = path.join(dataDir, "data.json");

  try {
    const jsonData = await fs.readFile(dataFile);
    return JSON.parse(jsonData);
  } catch (error) {
    const emptyDb = {
      users: {},
      packages: {},
    };

    if (error.code === "ENOENT") {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.appendFile(dataFile, JSON.stringify(emptyDb, null, 2));
    }

    return emptyDb;
  }
}

async function saveData(data) {
  const dataFile = path.join(dataDir, "data.json");
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

module.exports = {
  async getPackages(userId) {
    const data = await loadData();
    return data.users[userId] || [];
  },

  async getUsers(_package) {
    const data = await loadData();
    return data.packages[_package] || [];
  },

  async addPackage(userId, _package) {
    const data = await loadData();

    if (!data.users[userId]) {
      data.users[userId] = [_package];
    } else if (!data.users[userId].find((pack) => pack === _package)) {
      data.users[userId].push(_package);
    }

    if (!data.packages[_package]) {
      data.packages[_package] = [userId];
    } else if (!data.packages[_package].find((uId) => uId === userId)) {
      data.packages[_package].push(userId);
    }

    await saveData(data);

    return data.users[userId] || [];
  },

  async removePackage(userId, _package) {
    const data = await loadData();

    if (
      data.users[userId] &&
      data.users[userId].find((pack) => pack === _package)
    ) {
      data.users[userId] = data.users[userId].filter(
        (pack) => pack !== _package
      );
    }

    if (
      data.packages[_package] &&
      data.packages[_package].find((uId) => uId === userId)
    ) {
      data.packages[_package] = data.packages[_package].filter(
        (uId) => uId !== userId
      );
    }

    await saveData(data);

    return data.users[userId] || [];
  },

  async clearPackages(userId) {
    const data = await loadData();

    const packages = data.users[userId] || [];
    for (const _package of packages) {
      data.packages[_package] = data.packages[_package].filter(
        (uId) => uId !== userId
      );
      if (data.packages[_package].length === 0) {
        delete data.packages[_package];
      }
    }

    delete data.users[userId];

    await saveData(data);

    return [];
  },
};
