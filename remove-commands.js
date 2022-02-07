require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENTID;
const guildId = process.env.GUILDID;

const rest = new REST({ version: '9' }).setToken(token);

rest.get(Routes.applicationCommands(clientId))
	.then(data => {
		const promises = [];
		for (const command of data) {
			const deleteUrl = `${Routes.applicationGuildCommand(clientId, guildId)}/${command.id}`;
			promises.push(rest.delete(deleteUrl));
		}
		return Promise.all(promises);
	});