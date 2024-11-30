import { Events } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {
        try {
            if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.warn(`Command not found: ${interaction.commandName}`);
                if (interaction.isCommand()) {
                    await interaction.reply({
                        content: "This command is no longer available.",
                        ephemeral: true
                    });
                }
                return;
            }

            if (interaction.isAutocomplete() && command.autocomplete) {
                await command.autocomplete(interaction);
            } else if (interaction.isCommand()) {
                await command.execute(interaction);
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            
            if (interaction.isCommand() && !interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'There was an error executing this command.',
                    ephemeral: true
                }).catch(console.error);
            }
        }
    }
};