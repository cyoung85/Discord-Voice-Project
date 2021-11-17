//imports node's files system (fs) along with the config file and the discord.js file.
const fs = require('fs');
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
// const { OpusEncoder } = require('@discordjs/opus');

// //used for running the python program
// const express = require('express');
// const { spawn } = require('child_process');
// const app = express();
// const port = 3000;

const client = new Discord.Client();
//sets up a command cooldown for users to prevent spamming the bot
client.cooldowns = new Discord.Collection();
//uses the map feature of js
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');

//looks through each subdirectory in the commands file and maps the js files it to a command.
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

//starts the python program
// app.get('/', (req, res) => {
//     // eslint-disable-next-line no-var
//     var dataToSend;
//     const py = spawn('pyhton', ['voiceRec.py']);
//     py.stdout.on('data', function (data){
//         console.log('Pipe data from py script');
//         dataToSend = data.toString();
//     });
//     //print close code and send data when the process ends
//     py.on( 'close', (code) => {
//         console.log(`Child process closes with ${code}`);
//         res.send(dataToSend);
//     });
// });

// app.listen(port, () => console.log(`app listening on port ${port}.`));

//triggers the following events once the client is ready
client.once('ready', () => {
    console.log('Lets Go!');
});


//"loop" that scans channels for commands
client.on('message', message => {
    //checks to see if a command is given with its proper prefix, also prevents the bot from reading its own output
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //get the arguments for any input command (Note: the / +/ in the split is used to clear extra spaces, preventing extra preceved arguments)
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    //stores the command after the prefix
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(!command) return;

    if (command.args && !args.length){
        let reply = `You didn't provide any arguments, ${message.author}!`;

       if(command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      }
       return message.channel.send(reply);
    }

    //checks to see if the user has permission to use that command
    if(command.permissions){
        const authorPerms = message.channel.permissionsFor(message.author);
        if(!authorPerms || !authorPerms.has(command.permissions)){
            return message.reply('You can not do this!');
        }
    }

    //check to see if a command is able to be executed via direct message, if not, yell at them
    if(command.guildOnly && message.channel.type === 'dm'){
        return message.reply('Stop trying to dm the bot >:(');
    }

    const { cooldowns } = client;

    //checks to see if the current command is in the cooldowns collection, if not add it
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }

    //data we will use to see if a command's cooldown has expired
    const currentTime = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cdAmount = command.cooldown * 1000;

    //sees if the current user is in the cooldown collection
    if(timestamps.has(message.author.id)){
        //the time the command was sent
        const experationTime = timestamps.get(message.author.id) + cdAmount;

        if(currentTime < experationTime){
            const timeLeft = (experationTime - currentTime) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before trying to use the ${command.name} command.`);
        }
    }
    //deletes the entery after the time is up
    timestamps.set(message.author.id, currentTime);
    setTimeout(() => timestamps.delete(message.author.id), cdAmount);

    //executes the command, catches any errors (normally if the command dose not exist)
    try {
        command.execute(message, args);
    // eslint-disable-next-line brace-style
    } catch (error) {
        console.error(error);
        message.reply('There was an error while trying to execute that command.');
    }
});
//logs the bot in using its token that is saved in the config file.
client.login(token);