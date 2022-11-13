const { Client } = require("discord.js");
const { getUsers } = require("./utils/database.js");
const { token, updateChannelId } = require("./config.json");

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
  await processUpdates(updates);
});

async function parse(content) {
  const lines = content.split("\n");
  return lines.map((l) => l.split(/:\s?/));
}

async function processUpdates(updates) {
  const client = new Client({ intents: [] });
  await client.login(token);

  let channel = null;
  if (updateChannelId) {
    channel = await client.channels.fetch(updateChannelId);
    if (channel && !channel.isTextBased()) {
      console.error("The channel must be text based");
      channel = null;
    }
  }

  for (const [_package, message] of updates) {
    if (!_package || !message) {
      continue;
    }

    if (channel) {
      await postToChannel(channel, _package, message);
    }

    await notifyUsers(client, _package, message);
  }

  await client.destroy();
}

async function postToChannel(channel, _package, message) {
  const embed = {
    title: _package,
    description: message,
  };

  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(error);
  }
}

async function notifyUsers(client, _package, message) {
  const userIds = await getUsers(_package);
  if (userIds.length == 0) {
    return;
  }

  const content = `${_package}: ${message}`;

  for (const userId of userIds) {
    try {
      let user = client.users.cache.get(userId);
      if (!user) {
        user = await client.users.fetch(userId);
      }

      await user.send(content);
    } catch (error) {
      console.error(error);
    }
  }
}
