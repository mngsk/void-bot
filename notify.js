const { Client } = require("discord.js");
const { getUsers } = require("./database.js");
const { token } = require("./config.json");

const readable = process.stdin;

const chunks = [];
readable.on("readable", () => {
  let chunk;
  while ((chunk = readable.read()) !== null) {
    chunks.push(chunk);
  }
});
readable.on("end", async () => {
  const content = chunks.join("");
  const updates = await parse(content);
  await notify(updates);
});

async function parse(content) {
  const lines = content.split("\n");
  return lines.map((l) => l.split(/:\s?/));
}

async function notify(updates) {
  const client = new Client({ intents: [] });
  await client.login(token);

  for (const [_package, message] of updates) {
    try {
      const userIds = await getUsers(_package);
      if (userIds.length > 0) {
        for (const userId of userIds) {
          try {
            const user = await client.users.fetch(userId);
            await user.send(`${_package}: ${message}`);
          } catch (error) {
            console.error(error);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  await client.destroy();
}
