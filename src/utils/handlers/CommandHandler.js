// src/utils/handlers/CommandHandler.js
import { REST, Routes, Collection } from "discord.js";
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class CommandHandler {
    constructor(client) {
        this.client = client;
        this.commandsPath = join(__dirname, '../../commands');
        this.commands = new Collection();
        this.rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    }

    async loadCommands() {
        try {
            // Load commands from each category directory
            const categories = await readdir(this.commandsPath);
            
            for (const category of categories) {
                const categoryPath = join(this.commandsPath, category);
                const commandFiles = (await readdir(categoryPath)).filter(file => file.endsWith('.js'));

                console.log(`📁 Loading ${commandFiles.length} commands from ${category} category`);

                for (const file of commandFiles) {
                    try {
                        const commandModule = await import(`../../commands/${category}/${file}`);
                        const command = commandModule.default;

                        if (!command?.data?.name) {
                            console.error(`⚠️ Command in ${file} is missing required properties`);
                            continue;
                        }

                        this.commands.set(command.data.name, command);
                        console.log(`✅ Loaded command: ${command.data.name}`);

                    } catch (error) {
                        console.error(`❌ Error loading command from ${file}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error reading commands directory:', error);
            throw error;
        }
    }

    async deployCommands() {
        if (this.commands.size === 0) {
            throw new Error('No commands loaded! Run loadCommands() first.');
        }

        const commandData = this.commands.map(command => command.data.toJSON());

        try {
            console.log(`🚀 Starting deployment of ${commandData.length} commands globally...`);
            
            const data = await this.rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commandData }
            );

            console.log(`✨ Successfully deployed ${data.length} commands globally!`);
            return data;
        } catch (error) {
            console.error('❌ Error deploying commands:', error);
            throw error;
        }
    }

    async initialize() {
        try {
            await this.loadCommands();
            await this.deployCommands();
            this.client.commands = this.commands;
            console.log(`🎮 Command handler initialized with ${this.commands.size} commands`);
        } catch (error) {
            console.error('❌ Failed to initialize command handler:', error);
            throw error;
        }
    }
}

export const initializeCommands = async (client) => {
    const handler = new CommandHandler(client);
    await handler.initialize();
};
