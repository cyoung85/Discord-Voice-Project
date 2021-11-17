module.exports = {
    name: 'leave',
    description: 'Makes the bot leave the voice channel',
    guildOnly: true,
    cooldown: 5,
    execute(message, args, client){
        return client.leaveVoiceChannel(message.member.voice.channel);
    },
};