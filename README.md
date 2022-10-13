# Void Bot

This is a Discord bot created for the
[unofficial Void Linux server](https://discord.gg/5REm8FcMms).

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

## Instructions

Setup the `cronjob.sh` file to run periodically, for example, using `crontab` to
execute it every 15 minutes:

```sh
$ crontab -e
```

```
0,15,30,45 * * * * /full/path/to/cronjob.sh
```

The cronjob will obtain the commit messages since the last time it ran and send
them to the `notify.js` Node.js application, which will parse them and send the
corresponding messages to the users who have those packages on their watchlists.

For the Discord commands to work, the main Node.js application must be running,
and the bot must be already integrated to the server. See the
[discord.js guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#creating-and-using-your-invite-link)
for instruction on how to generate an invite link.

```sh
$ npm install
$ node index.js
```

## Configuration

You need to configure the bot's `token` and `clientId`, as well as the `guildId`
of your server on the `config.json` file. See the
[discord.js guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
for more information on how to set it up.

You must also specify a data directory, both in the config file and inside of
the `cronjob.sh` file (must be the same in both places).

## License

Void Bot is available under the
[ISC license](https://opensource.org/licenses/ISC). It also includes external
libraries that are available under a variety of licenses. See
[LICENSE](./LICENSE) for the full license text.
