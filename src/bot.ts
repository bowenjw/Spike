import { DiscordjsError, DiscordjsErrorCodes, GatewayIntentBits as Intents, Partials } from 'discord.js';
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
            commandPath: join(__dirname, 'commands', 'chat', 'builders'),
            contextMenuPath: join(__dirname, 'commands', 'context_menu'),
        }),
        connect(process.env.DB_URI),
    ]);

    await client.login(process.env.TOKEN);
})();


client.login(process.env.TOKEN)
    .catch((err:unknown) => {
        if (err instanceof DiscordjsError) {
            if (err.code == DiscordjsErrorCodes.TokenMissing) {
                console.warn(`\n[Error] ${err.name}: ${err.message} Did you create a .env file?\n`);
            }
            else if (err.code == DiscordjsErrorCodes.TokenInvalid) {
                console.warn(`\n[Error] ${err.name}: ${err.message} Check your .env file\n`);
            }
            else {
                throw err;
            }
        }
        else {
            throw err;
        }
    });

