import { ButtonInteraction } from "discord.js";
import { renderWarnings, warning } from "../../util/warning";

export async function buttomInteractionExecute(interaction:ButtonInteraction) {
    const message = interaction.message,
    pream = interaction.customId.split(' '),
    targetId = pream[1], start = Number(pream[2]),
    records = await warning.get(interaction.guildId!, targetId)
    interaction.update(renderWarnings(records, targetId ,start))


}