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
            const mojangResponse = await axios.get(
                `https://api.mojang.com/users/profiles/minecraft/${username}`,
                {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'NameQuest/1.0'
                    }
                }
            );

            const uuid = mojangResponse.data.id;

            const labyResponse = await axios.get(
                `https://laby.net/api/v2/user/${uuid}/get-profile`,
                {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'NameQuest/1.0'
                    }
                }
            );

            return {
                success: true,
                NameHistory: labyResponse.data.username_history || []
            };

        } catch (error) {
            if (error.response?.status === 404) {
                return { 
                    success: false, 
                    reason: "Username not found in Mojang database" 
                };
            }
            
            return { 
                success: false, 
                reason: "Failed to fetch data from LabyMod API" 
            };
        }
    }
};