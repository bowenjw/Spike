import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Amputator } from "../../system/Amputator";
import { ContextMenu } from "../../types";

const contextmenu:ContextMenu = {
    name:"Amputator",
    contextMenuBuilder: new ContextMenuCommandBuilder()
        .setName("Amputator")
        .setType(ApplicationCommandType.Message)
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction: MessageContextMenuCommandInteraction) {
        
        const regLink = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gim
        let match: RegExpExecArray | null,
            links: string[] = [];
        while (( match = regLink.exec(interaction.targetMessage.content)) != null) {
            links.push(match[0])
        }
        if(links.length > 0) {
            interaction.deferReply();
            interaction.followUp({content:`${await Amputator(links)}`})
        } else {
            interaction.reply({content:"No Links Found", ephemeral:true})
        }
        
    },
}
export = contextmenu;