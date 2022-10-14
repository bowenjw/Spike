import { ForumChannel, ModalSubmitInteraction } from "discord.js";
import { Modal } from "../../types";

async function execute(interaction: ModalSubmitInteraction) {
    interaction.reply({content:'Your suggestion has been Noted', ephemeral:true});
    const channelOut = (await interaction.guild?.channels.fetch('1029498545499283456')) as ForumChannel
    channelOut.threads.create({})
}

export const modal: Modal = {
    name:"suggestion",
    execute: execute
}


