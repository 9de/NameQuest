 
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class EventHandler {
    constructor(client) {
        this.client = client;
        this.eventsPath = join(__dirname, '../../events');
    }

    async loadEvents() {
        try {
            const eventFiles = await readdir(this.eventsPath);
            const jsFiles = eventFiles.filter(file => file.endsWith('.js'));

            console.log(`📁 Found ${jsFiles.length} event files to load`);

            for (const file of jsFiles) {
                try {
                    const eventModule = await import(`../../events/${file}`);
                    const event = eventModule.default;

                    if (!event?.name) {
                        console.error(`⚠️ Event in ${file} is missing 'name' property`);
                        continue;
                    }

                    if (event.once) {
                        this.client.once(event.name, (...args) => 
                            this.executeEvent(event, ...args));
                    } else {
                        this.client.on(event.name, (...args) => 
                            this.executeEvent(event, ...args));
                    }

                    console.log(`✅ Loaded ${event.once ? 'once' : 'on'} event: ${event.name}`);

                } catch (error) {
                    console.error(`❌ Error loading event from ${file}:`, error);
                }
            }
        } catch (error) {
            console.error('❌ Error reading events directory:', error);
            throw error;
        }
    }

    async executeEvent(event, ...args) {
        try {
            await event.execute(...args);
        } catch (error) {
            console.error(`❌ Error executing event ${event.name}:`, error);
        }
    }

    async initialize() {
        try {
            await this.loadEvents();
            console.log('🎮 Event handler initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize event handler:', error);
            throw error;
        }
    }
}

export const initializeEvents = async (client) => {
    const handler = new EventHandler(client);
    await handler.initialize();
};
