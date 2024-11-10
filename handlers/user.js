const { Markup } = require('telegraf');
const helpers = require('../utils/helpers');

module.exports = (bot, storage) => {
    // Start command
    bot.command('start', async (ctx) => {
        const startMessage = `
Welcome to GuardianBot! 🛡️

I'm here to help manage and protect your group.
Use /help to see available commands.
        `;

        const startButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('📚 Help', 'show_help'),
                Markup.button.callback('ℹ️ About', 'show_about')
            ]
        ]);

        await ctx.reply(startMessage, startButtons);
    });

    // Help command
    bot.command('help', async (ctx) => {
        const helpMessage = `
*Available Commands:*

*User Commands:*
/start - Start the bot
/help - Show this help message
/rules - Show group rules
/info - Show group information
/stats - Show your statistics

*Admin Commands:*
/admin - Open admin panel
/ban - Ban a user
/unban - Unban a user
/warn - Warn a user
/mute - Mute a user
/unmute - Unmute a user

*Reply to a message with command where applicable*
        `;

        await ctx.replyWithMarkdown(helpMessage);
    });

    // User stats command
    bot.command('stats', async (ctx) => {
        const userId = ctx.from.id.toString();
        const userStats = storage.userStats.get(userId) || {
            messageCount: 0,
            warnings: 0,
            joinDate: Date.now()
        };

        const statsMessage = `
📊 *Your Statistics*

Messages: ${userStats.messageCount}
Warnings: ${userStats.warnings}
Member Since: ${new Date(userStats.joinDate).toLocaleDateString()}
        `;

        await ctx.replyWithMarkdown(statsMessage);
    });
}; 