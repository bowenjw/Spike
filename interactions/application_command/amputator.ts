import { ApplicationCommandType, ChatInputCommandInteraction, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import https from 'https'

const permissionFlagsBits = PermissionFlagsBits.SendMessages;
const hyperlink = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gim
export const messageContextMenuCommand = new ContextMenuCommandBuilder()
    .setName("Amputator")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(true)
    .setDefaultMemberPermissions(permissionFlagsBits),

slashCommandBuilder = new SlashCommandBuilder()
    .setName('amputator')
    .setDescription('Get non AMP versions of websites')
    .setDMPermission(true)
    .setDefaultMemberPermissions(permissionFlagsBits)
    .addStringOption(option => option
        .setName("link")
        .setDescription("Link to AMPed webstie")
        .setRequired(true))

export async function commandExecute(interaction: ChatInputCommandInteraction | MessageContextMenuCommandInteraction) {
    
   
    let match: RegExpExecArray | null,
        links: string[] = [];
    
    if(interaction.isChatInputCommand()){
        links[0] = interaction.options.getString("link",true);
        if(!hyperlink.test(links[0])) {
            interaction.reply({
                content: 'Please provide a link starting with `https://`',
                ephemeral: true
            });
            return;
        }
    } else if(interaction.isMessageContextMenuCommand()) {
        while (( match = hyperlink.exec(interaction.targetMessage.content)) != null) {
            links.push(match[0])
        }
        if(links.length <= 0) {
            interaction.reply({
                content:"No Links Found",
                ephemeral:true
            })
            return;
        }

    } else {
        return;
    }
    // console.log(deampLink);
    interaction.reply({
        content: `${await Amputator(links)}`,
        ephemeral: !interaction.isMessageContextMenuCommand()
    })
}

/**
 * 
 * @param link The query; (text with) one or more AMP URLs. Must be the last parameter specified.
 * @param gac Whether to use the canonical-finding method guess-and-check. While prone to errors, it's handy as a last resort. It essentially guesses canonical links and tests to see if they could be correct.
 * @param md The maximum number of refferals to canonicals to follow (max-depth). AmputatorBot keeps scraping referred canonical pages untill the max-depth has been reached.
 * @returns retunes a response string
 */
 async function Amputator(link:string[] | string, gac:boolean = true, md: number = 3) {
    let APITarget = `https://www.amputatorbot.com/api/v1/convert?gac=${gac}&md=${md}&q=`,
        resolve = 'de-AMPed Link(s):\n';
    
    if(typeof link != 'string') {
        link.forEach((link)=>{
            APITarget += `${link};`
        })
    }
    (await httpGet(APITarget)).forEach(link => {
        resolve +=`${link.canonical.url}\n`
    })
    return resolve;

}

function httpGet(apiLink:string) {
    return new Promise<AmputatorResponse[]>(function(resolve, reject) {
        https.get(apiLink, (resp) => {
            let data = '';

            resp.on('data', (chunk) =>{ data += chunk });

            resp.on('end', () => { resolve(JSON.parse(data)) });

        }).on('error', err=> { reject(err) });
    })
}

interface AmputatorResponse {
    "amp_canonical": amputatorSubResponse,
    "canonical": amputatorSubResponse,
    "canonicals":amputatorSubResponse[],
    "origin": {
        "domain": string,
        "is_amp": boolean,
        "is_cached": boolean,
        "is_valid": boolean,
        "url": string,
    },
}

interface amputatorSubResponse {
    "domain": string,
    "is_alt": boolean,
    "is_amp": boolean,
    "is_cached": boolean,
    "is_valid": boolean,
    "type": string,
    "url": string,
    "url_similarity": number
}