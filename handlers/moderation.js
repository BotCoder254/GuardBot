const { Markup } = require('telegraf');
const helpers = require('../utils/helpers');

module.exports = (bot, storage) => {
    // Warn command
    bot.command('warn', async (ctx) => {
        if (!await helpers.isAdmin(ctx)) return;
        if (!ctx.message.reply_to_message) {
            return ctx.reply('⚠️ Reply to a message to warn the user');
        }

        const userId = ctx.message.reply_to_message.from.id.toString();
        const group = helpers.getGroup(storage, ctx.chat.id.toString());
        
        group.warnings = group.warnings || new Map();
        const currentWarnings = (group.warnings.get(userId) || 0) + 1;
        group.warnings.set(userId, currentWarnings);

        if (currentWarnings >= 3) {
            try {
                await ctx.banChatMember(userId);
                ctx.reply('🚫 User banned for exceeding warning limit');
                group.warnings.delete(userId);
            } catch (error) {
                console.error('Ban error:', error);
            }
        } else {
            ctx.reply(`⚠️ User warned (${currentWarnings}/3)`);
        }
    });

    // Mute command
    bot.command('mute', async (ctx) => {
        if (!await helpers.isAdmin(ctx)) return;
        if (!ctx.message.reply_to_message) {
            return ctx.reply('⚠️ Reply to a message to mute the user');
        }

        try {
            await ctx.restrictChatMember(ctx.message.reply_to_message.from.id, {
                can_send_messages: false,
                until_date: Math.floor(Date.now() / 1000) + 3600 // 1 hour
            });
            ctx.reply('🤐 User has been muted for 1 hour');
        } catch (error) {
            ctx.reply('❌ Failed to mute user');
            console.error('Mute error:', error);
        }
    });
}; 