const { prefix } = require('../../config.json');
module.exports = {
    name: 'help',
    description: 'Gives a list of all commands or info on a specific command',
    aliases: ['commands', 'info'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args){
        const data = [];
        const { commands } = message.client;

        //checks to see if any args are sent, if not, direct message them a list of all commands.
        if (!args.length){
            data.push('Here\'s a list of all commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send\`${prefix}help [command]\` to get info on that command.`);

            return message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with all my commands!');
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you!');
            });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.include(name));
        //if the added argument doesnt match another command
        if (!command){
            return message.reply(`that's not a vailid command. Try \`${prefix}help\` to see all commands`);
        }

        //pushes strings on the data array for each modifier to a command
        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command, this.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown} Second(s)`);

        message.channel.send(data, { split: true });
    },
};