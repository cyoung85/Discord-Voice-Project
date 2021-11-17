/* eslint-disable no-unused-vars */
module.exports = {
	name: 'dab',
	description: 'This is a test command',
	guildOnly: true,
	cooldown: 5,
	execute(message) {
		message.channel.send('<:Guzz_Dab:423632310257057792>');
	},
};