import { ButtonInteraction, GuildCacheMessage } from "discord.js";
import warnSchema from '../../schema/warnschema';

module.exports = {
	async execute(interaction:ButtonInteraction) {
        
        const splitbutton = interaction.customId.split(' ');
        const mode = splitbutton[1];
        const target = interaction.guild!.members.cache.find((member)=> member.id == splitbutton[2])
        const dbid = splitbutton[3];
        let content = 'Error';
        if(mode == 'cancel') {
            content = 'Action Canceled';

            async () => {
                if(dbid) {
                    warnSchema.findByIdAndDelete(dbid).catch((error)=> console.log(error));
                }
           }
        } else if (mode == 'deleteAll') {
            await warnSchema.deleteMany({guildID:interaction.guild?.id, userID:target?.id})
            content = `${target} has had all warnings removed`;
        } else if (mode == 'deleteOne') {
            await warnSchema.findByIdAndDelete(dbid);
            content = `${target} has had the most resent warnning removed`;
        } else if (mode == 'warnning')
        {
            if(splitbutton[3] == 'silent') {
                target?.send({content: `You have recived a warnning from ${interaction.guild?.name}`});
                content = `${target} has been warned`;
            } else {
                interaction.channel?.send(`${target}, You have been warned by ${interaction.user}`);
                content = 'Action Complete';
            }
        }
        interaction.update({content:content, embeds:[], components:[]})
    }
}