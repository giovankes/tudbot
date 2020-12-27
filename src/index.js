// Understand node process at https://nodejs.org/api/process.html#process_process
const process = require('process');
process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(1);
});

try {
    var Discord = require("discord.js");
} catch (error) { // dependencies hasn't been installed
    console.error("Please install dependencies with 'npm install --only=prod'");
    process.exit();
}

const auth = require("../auth.json");
// if the token hasn't been change from 'YOUR BOT TOKEN'
if (!Object.prototype.hasOwnProperty.call(auth, 'BOT_TOKEN') || auth.BOT_TOKEN === 'YOUR BOT TOKEN') {
    console.error("Please enter your bot token at ./auth.json");
    process.exit()
}

const data = require("./data");
let adminCmds = require("./commands/admin"); // Admin commands

const bot = new Discord.Client();

bot.on("message", function (message) {
    if (message.author.bot) return; // The message is from a bot
    if (!message.content.startsWith(data.prefix)) return; // The message don't concern me.

    const commandBody = message.content.slice(data.prefix.length);
    const args = commandBody.split(' ');

    if (args.length === 0) return; // There is no command
    const command = args.shift().toLowerCase();

    // Check if this is a command for admins & if the user is an admin
    if (Object.keys(adminCmds).includes(command) && (message.member.hasPermission('ADMINISTRATOR'))) {
        return adminCmds[command].process(message, args);
    }
});

// Connect the bot to the server
bot.login(auth.BOT_TOKEN).catch((error) => {
    if (error.code === "TOKEN_INVALID") {
        console.error("The token of the bot is invalid, please change it at ./auth.json"); // tell to insert a valid bot token
    } else {
        console.error(error) // in case of other error (Discord is offline)
    }
    process.exit();
});
