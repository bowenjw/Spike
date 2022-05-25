import { ButtonInteraction, GuildCacheMessage } from "discord.js";
import warnSchema from '../../schema/warnschema';

module.exports = {
	async execute(interaction:ButtonInteraction) {
        
        const splitbutton = interaction.customId.split(' ');
        const mode = splitbutton[1];
        const dbid = splitbutton[3];
        const target = interaction.guild!.members.cache.find((member)=> member.id == splitbutton[2])
        const message = interaction.message;
        if(mode == 'y') {
            warnSchema.findById(dbid).deleteOne();
            interaction.update({content:`${target} has had the most resent warnning removed`, embeds:[], components:[]})
        } else {
            interaction.update({content:'Action Canceled', embeds:[], components:[]});
        }
    }
}