import { ApplicationCommandType, ChatInputCommandInteraction, MessageContextMenuCommandInteraction } from 'discord.js';
import { AmputatorResponse } from '../interfaces';
import https from 'https';
import ExtendedClient from '../classes/ExtendedClient';


// eslint-disable-next-line no-useless-escape
const hyperlink = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gim;

export async function amputator(_client:ExtendedClient, interaction:ChatInputCommandInteraction | MessageContextMenuCommandInteraction) {
    let match: RegExpExecArray | null;
    const links: string[] = [];
    switch (interaction.commandType) {
    // Message Contex Menu
    case ApplicationCommandType.Message:
        while ((match = hyperlink.exec(interaction.targetMessage.content)) != null) {
            links.push(match[0]);
        }
        if (links.length <= 0) {
            interaction.reply({
                content:'No Links Found',
                ephemeral:true,
            });
            return;
        }
        break;
        // Chat Command
    case ApplicationCommandType.ChatInput:
        links[0] = interaction.options.getString('link', true);
        if (!hyperlink.test(links[0])) {
            interaction.reply({
                content: 'Please provide a link starting with `https://`',
                ephemeral: true,
            });
            return;
        }
        break;
    default:
        break;
    }
    interaction.reply({
        content: `${await Amputator(links)}`,
        ephemeral: !interaction.isMessageContextMenuCommand(),
    });
}

/**
 *
 * @param link The query; (text with) one or more AMP URLs. Must be the last parameter specified.
 * @param gac Whether to use the canonical-finding method guess-and-check. While prone to errors, it's handy as a last resort. It essentially guesses canonical links and tests to see if they could be correct.
 * @param md The maximum number of refferals to canonicals to follow (max-depth). AmputatorBot keeps scraping referred canonical pages untill the max-depth has been reached.
 * @returns retunes a response string
 */
async function Amputator(links:string[] | string, gac = true, md = 3) {
    let APITarget = `https://www.amputatorbot.com/api/v1/convert?gac=${gac}&md=${md}&q=`,
        resolve = 'de-AMPed Link(s):\n';

    if (typeof links != 'string') {
        links.forEach((link) => {
            APITarget += `${link};`;
        });
    }
    (await httpGet(APITarget)).forEach(link => {
        resolve += `${link.canonical.url}\n`;
    });
    return resolve;
}

function httpGet(apiLink:string) {
    return new Promise<AmputatorResponse[]>(function(resolve, reject) {
        https.get(apiLink, (resp) => {
            let data = '';

            resp.on('data', (chunk) => { data += chunk; });

            resp.on('end', () => { resolve(JSON.parse(data)); });

        }).on('error', err => { reject(err); });
    });
}