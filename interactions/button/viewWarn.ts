import { ButtonInteraction } from "discord.js";
import { renderWarnings, warnning } from "../../util/warnning";

export async function buttomInteractionExecute(interaction:ButtonInteraction) {
    const message = interaction.message,
    pream = interaction.customId.split(' '),
    targetId = pream[1], start = Number(pream[2]),
    records = await warnning.get(interaction.guildId!, targetId)
    interaction.update(renderWarnings(records, start))


}