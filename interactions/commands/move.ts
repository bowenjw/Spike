import { ChannelType, ChatInputCommandInteraction, GuildVoiceChannelResolvable, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types';
const command: Command = {
	name: 'move',
	description: 'move all users in VC to another VC',
	global: true,
	commandBuilder: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Gets the current latencey of the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels | PermissionFlagsBits.MoveMembers)
		.setDMPermission(false)
        .addChannelOption(option =>
            option.addChannelTypes(ChannelType.GuildVoice)
            .setName("destination")
            .setDescription("channel to move all users to")
            .setRequired(true)
        ),
	async execute(interaction: ChatInputCommandInteraction) {
        const sourceChannel = (await interaction.guild?.members.fetch(interaction.user.id))?.voice.channel,
        destination = interaction.options.getChannel("destination", true) as GuildVoiceChannelResolvable;
        let content = "test"
        // console.log(sourceChannel?.members)
        if (sourceChannel == null || sourceChannel == undefined) {
            content = "You must be in Voice Channel to use command";
        }
        else {
            sourceChannel.members.forEach((member) => {
                member.voice.setChannel(destination);
                content = `Users Moved have been moved to ${destination}`
            })
        }
		await interaction.reply({content: content ,ephemeral: true});
	},
}
export = command;