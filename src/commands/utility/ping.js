 
// src/commands/utility/ping.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { EMBED_COLORS } from "../../utils/constants.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check bot's latency and API response time"),

    async execute(interaction) {
        try {
            const sent = await interaction.reply({ 
                content: "📡 Pinging...", 
                ephemeral: true,
                fetchReply: true 
            });

            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            // Determine color based on latency
            const color = latency < 200 ? EMBED_COLORS.SUCCESS : 
                         latency < 500 ? EMBED_COLORS.WARNING : 
                         EMBED_COLORS.ERROR;

            const pingEmbed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ 
                    name: "🌟 Bot Status", 
                    iconURL: interaction.client.user.displayAvatarURL() 
                })
                .addFields([
                    {
                        name: "📶 Latency",
                        value: `\`${latency}ms\``,
                        inline: true
                    },
                    {
                        name: "♥️ API Heartbeat",
                        value: `\`${apiLatency}ms\``,
                        inline: true
                    }
                ])
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL() 
                })
                .setTimestamp();

            await interaction.editReply({ content: null, embeds: [pingEmbed] });
        } catch (error) {
            console.error("Error in ping command:", error);
            await interaction.editReply({
                content: "❌ Failed to check ping. Please try again later.",
                ephemeral: true
            }).catch(console.error);
        }
    }
};