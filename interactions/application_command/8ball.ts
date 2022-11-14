import {ChatInputCommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption} from 'discord.js';

//command options
const question = new SlashCommandStringOption()
	.setName('question')
	.setDescription('The question you wish to ask')
	.setRequired(true)

// Slash command
export const slashCommandBuilder = new SlashCommandBuilder()
	.setName('8ball')
	.setDescription('The Magic 8 Ball™ has all the answers to all of your most pressing questions!')
	.setDMPermission(true)
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addStringOption(question)

/**
 * 
 * @param interaction applicatrion command interaction
 */
async function commandExecute(interaction: ChatInputCommandInteraction) {
	let reply = '';
	switch (Math.floor(Math.random() * 20)) {
	case 0:
		reply = 'It is certain.';
		break;
	case 1:
		reply = 'As I see it, yes.';
		break;
	case 2:
		reply = 'Reply hazy, try again.';
		break;
	case 3:
		reply = 'Don`t count on it.';
		break;
	case 4:
		reply = 'It is decidedly so.';
		break;
	case 5:
		reply = ' Most likely.';
		break;
	case 6:
		reply = 'Ask again later.';
		break;
	case 7:
		reply = 'My reply is no.';
		break;
	case 8:
		reply = 'Without a doubt.';
		break;
	case 9:
		reply = 'Outlook good';
		break;
	case 10:
		reply = 'Better not tell you now.';
		break;
	case 11:
		reply = 'My sources say no.';
		break;
	case 12:
		reply = 'Yes definitely.';
		break;
	case 13:
		reply = 'Yes.';
		break;
	case 14:
		reply = 'Cannot predict now.';
		break;
	case 15:
		reply = 'Outlook not so good.';
		break;
	case 16:
		reply = 'You may rely on it.';
		break;
	case 17:
		reply = 'Signs point to yes.';
		break;
	case 18:
		reply = 'Concentrate and ask again.';
		break;
	case 19:
		reply = 'Very doubtful.';
		break;
	}
	const embed = new EmbedBuilder()
		.setColor('DarkButNotBlack')
		.setTitle('The Magic 8 Ball™')
		.setDescription('The Magic 8 Ball™ has all the answers to all of your most pressing questions!')
		.addFields(
			{ name: 'Question', value: (interaction.options as CommandInteractionOptionResolver).getString('question',true) },
			{ name: 'Answer', value: reply })
		.setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyiQvzUGEAdRklJkeFaKspuQPDicqsp5ff3A&usqp=CAU')
		.setTimestamp();
	await interaction.reply({ ephemeral: false, embeds: [embed] });
}
