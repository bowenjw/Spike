import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Interaction } from '../../classes/Interaction';

export default new Interaction<ButtonInteraction>()
    .setName('rules')
    .setExecute(async (interaction) => {
        interaction.reply({
            embeds:[new EmbedBuilder()
                .setColor(interaction.client.config.colors.embed)
                .setTitle('📜 Server Rules')
                .setDescription(`1️⃣ **Discrimination is PROHIBITED.** This includes harassment, hate speech, homophobia, transphobia, racism, sexism, ableism, trolling, and other forms of discrimination, including the use of discriminatory slurs. We have a zero-tolerance policy for such messages and offenders will be permanently banned from the server upon the first offense.

                2️⃣ **Personal attacks and insults, disrupting on-going conversations, disrespecting, piling on, attacking other members, and baiting for a reaction are NOT TOLERATED.** Keep all discussions and debates in good faith. Your points must reflect your own beliefs and you must be able to explain your points.
                
                > A good faith argument is an honest belief of a level-headed attempt to persuade the other person to your way of thinking, and to honestly appraise and grapple with their counter points.
                
                > A bad faith argument is a dishonest belief and/or an attempt to antagonize members, usually by ignoring what they say, engaging in personal insults, or insincerely engaging in arguments for the sake of provocation.
                
                _Repeated violations of this rule will result in a suspension or permanent ban from the server._
                
                3️⃣ **Posting anything that is NSFW or overly suggestive is PROHIBITED in the main channels.** This includes discussions about mature content. Please keep mature discussions in the verified 18+ channels. Reach out to a team member if you need help. Violating this rule will result in a permanent ban from the server upon first offense.
                
                4️⃣ **Spamming messages, spam pinging users, and/or self-promotion (server invites, advertisements, etc.) are NOT TOLERATED without permission from an admin.** This includes sending previously mentioned prohibited material to fellow members unsolicited. Repeat violations will result in a ban.
                
                5️⃣ **Conspiracy promotion is PROHIBITED (this includes posts in favor of antisemitic beliefs, eugenics, anti-vaccine, Genocide-Denial or Qanon conspiracies).** Not only will violating this rule result in an instant permanent ban, violating this rule is against Discord TOS and could result in being banned from Discord entirely.
                
                6️⃣ **Keep channels on-topic. Disruption of on-going conversations or spamming unrelated memes/images are NOT TOLERATED.** If this occurs occasionally and is an honest mistake, a suspension will not occur. However, deliberate repeat violations of this rule will result in a suspension from the server.
                
                7️⃣ **Recording private conversations without member's knowledge or consent is STRICTLY PROHIBITED.** The non-consensual recording and/or sharing of private conversations will result in a permanent ban. This is also illegal in Canada, the EU, and several US states, meaning violation of this rule could result in legal repercussions.`)],
            components:[new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder()
                    .setURL('https://dis.gd/tos')
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Discord Terms of Service'))
                .addComponents(new ButtonBuilder()
                    .setURL('https://dis.gd/guidelines')
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Discord Community Guidelines'))],
            ephemeral:true,
        });
    });

