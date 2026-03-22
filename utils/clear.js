const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config({
  path: "./config/config.env"
});

const API = axios.create({ baseURL: process.env.API_URL });

async function clearAll() {
  try {
    const auth = await API.post('/auth/login', { 
      email: process.env.ADMIN_EMAIL, 
      password: process.env.ADMIN_PASSWORD 
    });
    const config = { headers: { Authorization: `Bearer ${auth.data.token}` } };

    console.log("--- Clearing Poseidon Records ---");

    const resources = ['reservations', 'services', 'shops'];
    
    for (const type of resources) {
      const list = (await API.get(`/${type}`, config)).data.data || [];
      for (const item of list) {
        await API.delete(`/${type}/${item._id}`, config);
      }
      console.log(`🗑️ Deleted ${list.length} ${type}.`);
    }

    console.log("\nCleanup successful. Note: Users persist due to API limitations.");
  } catch (error) {
    console.error("❌ Clear failed:", error.response?.data || error.message);
  }
}

clearAll();