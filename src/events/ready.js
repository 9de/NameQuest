import { ActivityType, Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    
    async execute(client) {
        try {
            // Bot status configuration
            const activities = [
                { name: 'Minecraft Usernames', type: ActivityType.Watching },
                { name: `/namehistory`, type: ActivityType.Listening },
                { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }
            ];
            let currentActivity = 0;

            client.user.setPresence({
                activities: [activities[0]],
                status: 'online'
            });

            // Rotate activities every 10 minutes
            setInterval(() => {
                currentActivity = (currentActivity + 1) % activities.length;
                client.user.setPresence({
                    activities: [activities[currentActivity]],
                    status: 'online'
                });
            }, 600000);

            console.log('╔════════════════════════════════════════╗');
            console.log('║            NameQuest Bot              ║');
            console.log('╠════════════════════════════════════════╣');
            console.log(`║ Bot User: ${client.user.tag}`);
            console.log(`║ Guild Count: ${client.guilds.cache.size}`);
            console.log(`║ User Count: ${client.users.cache.size}`);
            console.log(`║ Command Count: ${client.commands?.size || 0}`);
            console.log('║ Status: Online');
            console.log('╚════════════════════════════════════════╝');

        } catch (error) {
            console.error('Error in ready event:', error);
        }
    }
};