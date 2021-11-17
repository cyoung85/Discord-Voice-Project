module.exports = {
    name: 'kick',
    description: 'Kicks a mentioned user',
    guildOnly: true,
    args: true,
    permissions: 'KICK_MEMBERS',
    cooldown: 5,
    execute(message){
        // grab the first mentioned user from the message
        //if no user is mentioned, return an error message
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user in order to kick them!');
        }
        const taggedUser = message.mentions.users.first();
        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
    },
};