module.exports = {
    BOT_NAME: "GuardianBot 🛡️",
    BOT_VERSION: "2.1",
    
    // Default settings
    defaults: {
        maxWarnings: 3,
        antiSpam: true,
        blockLinks: true,
        maxMessages: 10,
        muteDuration: 300,
        deleteWarnings: true,
        welcomeEnabled: false,
        funEnabled: true
    },
    
    // Cooldowns (in seconds)
    cooldowns: {
        commands: 3,
        games: 30,
        reports: 60
    }
}; 