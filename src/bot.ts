import { GatewayIntentBits as Intents, Partials } from 'discord.js';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import { join } from 'path';
import { Client } from './Client';

// Load .env file contents
config();

// Initialization (specify intents and partials)
const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.MessageContent,
        Intents.GuildMembers,
        Intents.GuildModeration,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
    ],
    receiveMessageComponents: true,
    receiveModals: true,
    receiveAutocomplete: true,
    replyOnError: true,
    splitCustomID: true,
    splitCustomIDOn: '_',
    useGuildCommands: false,
});

(async function start() {
    await Promise.all([
        client.init({
            eventPath: join(__dirname, 'events'),
            buttonPath: join(__dirname, 'interactions', 'buttons'),
            selectMenuPath: join(__dirname, 'interactions', 'select_menus'),
            modalPath: join(__dirname, 'interactions', 'modals'),
            commandPath: join(__dirname, 'commands', 'chat'),
            contextMenuPath: join(__dirname, 'commands', 'context'),
        }),
        connect(process.env.MONGO_URI),
    ]);

    await client.login(process.env.TOKEN);
})();
