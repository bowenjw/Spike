import { GuildMember, PermissionFlagsBits } from 'discord.js';
import { ChatInputCommand } from '../../Client';

export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName('timeout')
        .setDescription('Custom Timeout Command')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to timeout')
            .setRequired(true))
        .addNumberOption(option => option
            .setName('durations')
            .setDescription('How long they should be timed out for, if any')
            .setRequired(true)
            .setChoices(
                { name: '60 secs', value: 60 },
                { name: '5 mins', value: 300 },
                { name: '10 mins', value: 600 },
                { name: '30 mins', value: 1800 },
                { name: '1 hour', value: 3600 },
                { name: '2 hours', value: 7200 },
                { name: '6 hours', value: 21600 },
                { name: '12 hours', value: 43200 },
                { name: '1 Day', value: 86400 },
                { name: '3 Days', value: 259200 },
                { name: '1 week', value: 604800 }))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for timing them out')))
    .setGlobal(true)
    .setExecute(async (interaction) => {
        const user = interaction.options.getMember('user') as GuildMember,
            reason = interaction.options.getString('reason') || undefined,
            duration = interaction.options.getNumber('durations', true),
            endedDate = Math.floor(new Date().getTime() / 1000) + duration;

        user.timeout(duration * 1000, `Member was timed out by ${interaction.user.tag} for ${reason}`);

        interaction.reply({ content: `${user} has been timed out until <t:${endedDate}:F>`, ephemeral: true });
    });
