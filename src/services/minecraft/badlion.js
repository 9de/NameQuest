 
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
            // First get the buildId
            const buildId = await this.getBuildId();
            if (!buildId) {
                return {
                    success: false,
                    reason: "Failed to get Badlion build ID"
                };
            }

            // Get UUID from Mojang API first
            const mojangResponse = await axios.get(
                `https://api.mojang.com/users/profiles/minecraft/${username}`,
                {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0'
                    }
                }
            );

            const uuid = mojangResponse.data.id;

            // Then fetch from Badlion API
            const response = await axios.get(
                `https://www.badlion.net/_next/data/${buildId}/en/profile/minecraft/${uuid}.json`,
                {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0'
                    }
                }
            );

            const nameHistory = response.data.pageProps?.nameHistory || [];
            
            return {
                success: true,
                NameHistory: nameHistory.map(entry => ({
                    username: entry.name,
                    changed_at: entry.changedToAt
                }))
            };

        } catch (error) {
            if (error.response?.status === 404) {
                return { 
                    success: false, 
                    reason: "Username not found" 
                };
            }
            
            if (error.code === 'ECONNABORTED') {
                return { 
                    success: false, 
                    reason: "Request timed out" 
                };
            }

            return { 
                success: false, 
                reason: "Failed to fetch data from Badlion" 
            };
        }
    },

    async getBuildId() {
        try {
            const response = await axios.get('https://www.badlion.net', {
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
                    'host': "badlion.net",
                    "Accept" :"*/*"
                }
            });

            const html = response.data;
            const buildIdMatch = html.match(/"buildId":"([^"]+)"/);
            
            return buildIdMatch ? buildIdMatch[1] : null;

        } catch (error) {
            console.error('Error fetching Badlion buildId:', error);
            return null;
        }
    }
};