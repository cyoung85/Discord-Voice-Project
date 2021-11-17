module.exports = {
    name: 'join',
    description: 'Makes the bot join your current channel.',
    guildOnly: true,
    cooldown: 5,
    execute(message, args, client){
        return client.joinVoiceChannel(message.member.voice.channel);
    },
};