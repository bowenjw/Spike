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

        } else if (mode == 'warnning') {

            const length = splitbutton[3];
            const silent = splitbutton[4] == 'silent';
            let DM = `You have recived a warnning from ${interaction.guild?.name}`;
            let inChannel = `${target}, You have been warned by ${interaction.user}`;
            content = 'Action Complete';

            if(length == '2') {
                DM = `You have recived been banned from ${interaction.guild?.name}`;
                inChannel = `${target}, has been **BANNED** by ${interaction.user}`;
                content = `${target}, has been **BANNED** by ${interaction.user}`
                if(!silent) {
                    interaction.channel?.send(inChannel);
                }
                await target?.send(DM).catch((error) => console.log(error));
                target?.ban({reason:'User recive three warings over the past 90 days', days:1}).catch((error) => console.log(error));
            } else if(!silent) {
                interaction.channel?.send(inChannel);
            } else {
                target?.send(DM);
            }
        }
        interaction.update({content:content, embeds:[], components:[]})
    }
}