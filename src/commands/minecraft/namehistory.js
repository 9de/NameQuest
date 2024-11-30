 
// src/commands/minecraft/namehistory.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { EMBED_COLORS, SERVICE_ICONS } from "../../utils/constants.js";
import * as APIs from "../../services/index.js";

export default {
    data: new SlashCommandBuilder()
        .setName("namehistory")
        .setDescription("View a player's Minecraft username history across different services")
        .addStringOption(option => 
            option
                .setName("username")
                .setDescription("Minecraft username to lookup")
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(16)
        )
        .addStringOption(option => 
            option
                .setName("service")
                .setDescription("Choose which service to get history from")
                .addChoices(
                    { name: "All Services", value: "all" },
                    { name: "LabyMod", value: "labymod" },
                    { name: "Badlion", value: "badlion" },
                    { name: "Crafty.gg", value: "crafty" }
                )
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            
            const username = interaction.options.getString("username");
            const service = interaction.options.getString("service") || "all";
            
            const nameHistories = await this.fetchNameHistories(username, service);
            const resultEmbed = this.createResultEmbed(interaction, username, nameHistories);
            await interaction.editReply({ embeds: [resultEmbed] });
            
        } catch (error) {
            console.error("Error in namehistory command:", error);
            const errorEmbed = new EmbedBuilder()
                .setColor(EMBED_COLORS.ERROR)
                .setTitle("❌ Error")
                .setDescription(`Failed to fetch name history for **${username}**`)
                .setTimestamp();
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },

    async fetchNameHistories(username, service) {
        const results = {};
        
        const apiCalls = service === "all" ? 
            [
                { key: "labymod", api: APIs.labymod },
                { key: "badlion", api: APIs.badlion },
                { key: "crafty", api: APIs.craftygg }
            ] : 
            [{ key: service, api: APIs[service] }];

        await Promise.all(apiCalls.map(async ({ key, api }) => {
            try {
                const response = await api.NameHistory(username);
                results[key] = this.formatNameHistory(response, key);
            } catch (error) {
                results[key] = {
                    success: false,
                    message: "Failed to fetch data"
                };
            }
        }));

        return results;
    },

    formatNameHistory(response, service) {
        if (!response.success) {
            return {
                success: false,
                message: response.reason || "Unknown error occurred"
            };
        }

        const history = response.NameHistory.map(entry => {
            if (service === "labymod" && entry.username === "－") {
                return { username: "Hidden", timestamp: entry.changed_at || null };
            }
            return {
                username: entry.username || entry.name || entry,
                timestamp: entry.changed_at || entry.changedToAt || null
            };
        });

        return {
            success: true,
            history: history.reverse()
        };
    },

    createResultEmbed(interaction, username, results) {
        const embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.DEFAULT)
            .setAuthor({
                name: `${username}'s Name History`,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(`https://mc-heads.net/avatar/${username}/100`)
            .setTimestamp();

        Object.entries(results).forEach(([service, data]) => {
            const icon = SERVICE_ICONS[service];
            const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
            
            if (!data.success) {
                embed.addFields({
                    name: `${icon} ${serviceName}`,
                    value: `❌ ${data.message}`,
                    inline: false
                });
                return;
            }

            const historyText = data.history
                .map((entry, index) => {
                    const timestamp = entry.timestamp 
                        ? `<t:${Math.floor(new Date(entry.timestamp).getTime() / 1000)}:R>`
                        : "";
                    return `\`${index + 1}.\` ${entry.username} ${timestamp}`;
                })
                .join("\n");

            embed.addFields({
                name: `${icon} ${serviceName} (${data.history.length} names)`,
                value: historyText || "No name history found",
                inline: false
            });
        });

        embed.setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });

        return embed;
    }
};