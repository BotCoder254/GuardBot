const { Markup } = require('telegraf');
const helpers = require('../utils/helpers');

module.exports = (bot, storage) => {
    // Admin panel command
    bot.command('admin', async (ctx) => {
        if (!await helpers.isAdmin(ctx)) {
            return ctx.reply('⚠️ This command is for administrators only!');
        }

        const adminButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('🔄 Anti-Spam', 'toggle_spam'),
                Markup.button.callback('🔗 Links', 'toggle_links')
            ],
            [
                Markup.button.callback('👥 Members', 'manage_members'),
                Markup.button.callback('⚙️ Settings', 'show_settings')
            ],
            [
                Markup.button.callback('📊 Stats', 'show_stats'),
                Markup.button.callback('🎮 Fun Mode', 'toggle_fun')
            ]
        ]);

        await ctx.reply('🛠 *Admin Control Panel*', {
            parse_mode: 'Markdown',
            ...adminButtons
        });
    });

    // Ban command
    bot.command('ban', async (ctx) => {
        if (!await helpers.isAdmin(ctx)) return;
        if (!ctx.message.reply_to_message) {
            return ctx.reply('⚠️ Reply to a message to ban the user');
        }

        try {
            await ctx.banChatMember(ctx.message.reply_to_message.from.id);
            ctx.reply('✅ User has been banned');
        } catch (error) {
            ctx.reply('❌ Failed to ban user');
            console.error('Ban error:', error);
        }
    });

    // Unban command
    bot.command('unban', async (ctx) => {
        if (!await helpers.isAdmin(ctx)) return;
        if (!ctx.message.reply_to_message) {
            return ctx.reply('⚠️ Reply to a message to unban the user');
        }

        try {
            await ctx.unbanChatMember(ctx.message.reply_to_message.from.id);
            ctx.reply('✅ User has been unbanned');
        } catch (error) {
            ctx.reply('❌ Failed to unban user');
            console.error('Unban error:', error);
        }
    });
}; 