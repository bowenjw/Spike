import { ModalSubmitInteraction } from 'discord.js';
import { Interaction } from '../../Client';
import { warnUpdateModal } from '../../systems/warning';

export default new Interaction<ModalSubmitInteraction>()
    .setName('updateWarn')
    .setExecute(warnUpdateModal);
