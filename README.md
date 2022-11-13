# Void Bot

This is a bot created for the unofficial
[Void Linux Discord server](https://discord.gg/5REm8FcMms).

It gives the users the ability to subscribe for notifications about new and
updated packages.

Currently, the following commands are implemented:

- `/watch <package>` Adds the specified package to the user's watchlist
- `/unwatch <package>` Removes the specified package from the user's watchlist
- `/list` Enumerates the packages on the user's watchlist
- `/clear` Removes all packages from the user's watchlist

The bot periodically checks for updates on the
[void-packages](https://github.com/void-linux/void-packages) repository and
notifies the users subscribed to them.

## Configuration

Follow this
[guide on how to set up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
, followed by this
[guide on how to add the bot to a server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#creating-and-using-your-invite-link)
. You will need the bot's `tokenId` and `clientId`, as well as your server
`guildId`.

Fill the [config.json](./config.json) file with the corresponding values.

You must also specify a data directory, both in the config file and the
[cronjob.sh](./scripts/cronjob.sh) file (must be the same in both places).

## Usage

1. Install the project's dependencies

```sh
npm install
```

2. Deploy the commands to your server (only the first time or after adding new
   commands)

```sh
node deploy-commands.js
```

3. Start listening for commands

```sh
node index.js
```

4. Install the cronjob (for example, to run every 15 minutes)

```sh
crontab -e

0,15,30,45 * * * * /full/path/to/cronjob.sh
```

The cronjob will obtain the commit messages since the last time it ran and send
them to the [commit-parser.js](./commit-parser.js) Node.js application, which will parse them
and send the corresponding messages to the users who have those packages on
their watchlists.

## License

Void Bot is available under the
[ISC license](https://opensource.org/licenses/ISC). It also includes external
libraries that are available under a variety of licenses. See
[LICENSE](./LICENSE) for the full license text.
