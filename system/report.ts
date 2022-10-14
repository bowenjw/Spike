import { BaseInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction, ModalBuilder } from "discord.js";

export async function getReportModal(interaction: BaseInteraction) {
    
    switch (typeof interaction) {
        case typeof ChatInputCommandInteraction:
            
            break;
    
        default:
            break;
    }
}