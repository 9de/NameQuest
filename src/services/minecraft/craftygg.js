import axios from 'axios';

export default {
    NameHistory: async function(username) {
        if (!username || typeof username !== 'string') {
            return { 
                success: false, 
                reason: "Invalid username provided" 
            };
        }

        try {
            const response = await axios.get(`https://crafty.gg/players/${username}.json`, {
                timeout: 5000,
                headers: {
                    'User-Agent': 'NameQuest/1.0'
                }
            });
            const nameHistory = response.data.usernames?.map(entry => ({
                username: entry.username,
                changed_at: entry.changed_at
            })) || [];

            return {
                success: true,
                NameHistory: nameHistory
            };
        } catch (error) {
            const status = error.response?.status;
            
            if (status === 302 || status === 404) {
                return { 
                    success: false, 
                    reason: "Username not found" 
                };
            }
            
            return { 
                success: false, 
                reason: "Failed to fetch data from Crafty.gg" 
            };
        }
    }
};