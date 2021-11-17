/* eslint-disable no-unused-vars */
module.exports = {
	name: 'avatar',
	description: 'Takes a list of users (or defauts to yourself without arguments) and returns each users avitar as a message in discord.',
    guildOnly: true,
    args: true,
    cooldown: 5,
	execute(message, args) {
		//if no user is mentioned
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
        }
        //if 1 or more are mentioned
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: true })}>`;
        });
        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        message.channel.send(avatarList);
    },

};