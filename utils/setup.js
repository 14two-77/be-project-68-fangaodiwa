const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config({
  path: "./config/config.env"
});

const API = axios.create({ baseURL: process.env.API_URL });

const usersToEnsure = [
    { name: "Standard User", email: "user@example.com", phone: "0811111111", role: "user", tier: null },
    { name: "VIP Customer", email: "vip@poseidon.com", phone: "0822222222", role: "user", tier: "vip" },
    { name: "VVIP Legend", email: "vvip@poseidon.com", phone: "0833333333", role: "user", tier: "vvip_poseidon" }
];

// 5 Sample Shops
const shopData = [
    {
        name: "Oasis Retreat",
        address: "45 Sukhumvit Rd",
        phone: "02-111-2222",
        open_time: "09:00",
        close_time: "21:00",
        services: [
            { name: "Aromatherapy", price: 1500, duration: 60, tier: "vip", description: "Essential oil relaxation." },
            { name: "Deep Tissue", price: 1800, duration: 90, tier: "vip", description: "Firm pressure for muscle knots." },
            { name: "Foot Reflexology", price: 800, duration: 45, tier: "vip", description: "Targeted foot pressure points." },
            { name: "Zen Stone Therapy", price: 2200, duration: 100, tier: "vvip_poseidon", description: "Premium heated basalt stones." }
        ]
    },
    {
        name: "Zen Garden Spa",
        address: "88 Silom Rd",
        phone: "02-333-4444",
        open_time: "10:00",
        close_time: "22:00",
        services: [
            { name: "Hot Stone Massage", price: 2500, duration: 120, tier: "vvip_poseidon", description: "Full body heat therapy." },
            { name: "Matcha Scrub", price: 1200, duration: 45, tier: "vip", description: "Antioxidant-rich skin exfoliation." },
            { name: "Shiatsu Session", price: 1900, duration: 90, tier: "vip", description: "Traditional Japanese finger-pressure." }
        ]
    },
    {
        name: "Midnight Serenity",
        address: "12 Thong Lo",
        phone: "02-555-6666",
        open_time: "14:00",
        close_time: "02:00",
        services: [
            { name: "Swedish Massage", price: 1200, duration: 60, tier: "vip", description: "Classic rhythmic strokes." },
            { name: "Body Scrub", price: 900, duration: 45, tier: "vip", description: "Organic sea salt exfoliation." },
            { name: "Facial Treatment", price: 2000, duration: 60, tier: "vvip_poseidon", description: "Hydrating skin therapy." },
            { name: "Head & Shoulder", price: 700, duration: 30, tier: "vip", description: "Quick tension relief." },
            { name: "Midnight Oil Ritual", price: 3500, duration: 150, tier: "vvip_poseidon", description: "Exclusive late-night luxury package." }
        ]
    },
    {
        name: "Royal Thai Wellness",
        address: "77 Ratchadaphisek",
        phone: "02-777-8888",
        open_time: "08:00",
        close_time: "20:00",
        services: [
            { name: "Traditional Thai", price: 1000, duration: 90, tier: "vip", description: "Ancient stretching techniques." },
            { name: "Herbal Compress", price: 1400, duration: 90, tier: "vip", description: "Warm Thai herb bundles." },
            { name: "Royal Stretching", price: 1800, duration: 120, tier: "vvip_poseidon", description: "Advanced flexibility session." }
        ]
    },
    {
        name: "Azure Marine Spa",
        address: "202 Iconsiam",
        phone: "02-999-0000",
        open_time: "10:00",
        close_time: "22:00",
        services: [
            { name: "Sea Salt Glow", price: 1300, duration: 60, tier: "vip", description: "Marine-based body polish." },
            { name: "Oceanic Wrap", price: 2200, duration: 90, tier: "vvip_poseidon", description: "Mineral-rich seaweed wrap." },
            { name: "Hydrotherapy Bath", price: 3000, duration: 45, tier: "vvip_poseidon", description: "Premium therapeutic soak." },
            { name: "Anti-Aging Facial", price: 2800, duration: 75, tier: "vvip_poseidon", description: "Advanced collagen treatment." }
        ]
    }
];

async function getUserId(email, password) {
    try {
        const res = await API.post('/auth/login', { email, password });
        return res.data.data?._id || res.data.user?._id;
    } catch (err) {
        return null;
    }
}

async function ensureUser(user) {
    const password = "password123";

    // 1. Try Login
    let userId = await getUserId(user.email, password);
    if (userId) {
        console.log(`👤 User ${user.email} logged in successfully.`);
        return userId;
    }

    // 2. Try Register (if login failed)
    try {
        console.log(`🆕 Attempting to register ${user.email}...`);
        await API.post('/auth/register', { ...user, password });
        userId = await getUserId(user.email, password);
        return userId;
    } catch (err) {
        // 3. Fallback: If registration fails (e.g., phone/email duplicate), try one last login
        console.log(`⚠️ Register failed for ${user.email} (likely duplicate phone). Trying final login...`);
        userId = await getUserId(user.email, password);
        return userId;
    }
}

async function runSetup() {
    try {
        console.log("--- Starting Poseidon API Setup ---");

        // Admin Session
        const adminRes = await API.post('/auth/login', {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });
        const adminConfig = { headers: { Authorization: `Bearer ${adminRes.data.token}` } };

        // Handle Users & Tiers
        for (const u of usersToEnsure) {
            const userId = await ensureUser(u);
            if (userId && u.tier) {
                await API.put(`/users/${userId}/tier`, { tier: u.tier }, adminConfig);
                console.log(`   └─ Tier updated to: ${u.tier}`);
            }
        }

        // Handle Shops & Services
        for (const s of shopData) {
            const { services, ...info } = s;
            const shopRes = await API.post('/shops', info, adminConfig);
            const shopId = shopRes.data.data?._id || shopRes.data._id;
            console.log(`🏠 Shop Created: ${s.name}`);

            for (const svc of services) {
                await API.post('/services', { ...svc, shop: shopId, description: "Premium Spa Experience" }, adminConfig);
            }
        }

        console.log("\n--- Setup Finished ---");
    } catch (error) {
        console.error("❌ Critical Error:", error.response?.data || error.message);
    }
}

runSetup();