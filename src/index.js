// src/index.js
import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { initializeCommands } from "./utils/handlers/CommandHandler.js";
import { initializeEvents } from "./utils/handlers/EventHandler.js";

// Load environment variables
config();

// Initialize client with explicit intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
    allowedMentions: { parse: ['users', 'roles'] }
});

// Error handling for process-level errors
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Initialize handlers
try {
    await initializeCommands(client);
    await initializeEvents(client);
    await client.login(process.env.TOKEN);
} catch (error) {
    console.error('Failed to initialize bot:', error);
    process.exit(1);
}