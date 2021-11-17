module.exports = {
    name: 'args-info',
    Description: 'Sends you a comma seperated list of all argments added to this command',
    guildOnly: true,
    args: true,
    cooldown: 5,
    execute(message, args){
        message.channel.send(`Arguments: ${args}`);
    },
};