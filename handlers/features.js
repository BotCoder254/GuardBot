const { Markup } = require('telegraf');
const config = require('../config');

module.exports = (bot, storage) => {
    // Advanced Poll Creation
    bot.command('poll', async (ctx) => {
        const pollButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('📊 Multiple Choice', 'poll_multiple'),
                Markup.button.callback('✓ Single Choice', 'poll_single')
            ],
            [
                Markup.button.callback('🎯 Quiz', 'poll_quiz'),
                Markup.button.callback('❌ Cancel', 'poll_cancel')
            ]
        ]);
        
        await ctx.reply('🗳 Select poll type:', pollButtons);
    });

    // Advanced Group Statistics
    bot.command('groupinfo', async (ctx) => {
        if (!ctx.chat.type.includes('group')) return;
        
        const group = storage.groups.get(ctx.chat.id.toString()) || {
            stats: { messageCount: 0, memberCount: 0, lastActive: Date.now() }
        };
        
        const memberCount = await ctx.getChatMembersCount();
        const admins = await ctx.getChatAdministrators();
        
        const statsMessage = `
📊 *Group Statistics*

*Group Name:* ${ctx.chat.title}
*Group ID:* \`${ctx.chat.id}\`
*Members:* ${memberCount}
*Admins:* ${admins.length}
*Messages Today:* ${group.stats.messageCount}
*Last Active:* ${new Date(group.stats.lastActive).toLocaleString()}

*Settings:*
├ Anti-Spam: ${group.antiSpam ? '✅' : '❌'}
├ Link Protection: ${group.blockLinks ? '✅' : '❌'}
└ Fun Mode: ${group.funEnabled ? '✅' : '❌'}
`;
        
        await ctx.replyWithMarkdown(statsMessage);
    });

    // Advanced User Information
    bot.command('userinfo', async (ctx) => {
        const user = ctx.message.reply_to_message?.from || ctx.from;
        const userStats = storage.userStats.get(user.id.toString()) || {
            messageCount: 0,
            warnings: 0,
            joinDate: Date.now()
        };
        
        let status = 'Member';
        if (ctx.chat.type.includes('group')) {
            const member = await ctx.getChatMember(user.id);
            status = member.status.charAt(0).toUpperCase() + member.status.slice(1);
        }
        
        const userMessage = `
👤 *User Information*

*Name:* ${user.first_name}
*Username:* ${user.username ? '@' + user.username : 'None'}
*ID:* \`${user.id}\`
*Status:* ${status}
*Joined:* ${new Date(userStats.joinDate).toLocaleString()}

*Statistics:*
├ Messages: ${userStats.messageCount}
├ Warnings: ${userStats.warnings}
└ Status: ${userStats.warnings > 0 ? '⚠️' : '✅'}
`;
        
        await ctx.replyWithMarkdown(userMessage);
    });

    // Advanced Search
    bot.command('search', async (ctx) => {
        const query = ctx.message.text.split(' ').slice(1).join(' ');
        if (!query) return ctx.reply('⚠️ Please provide a search term');
        
        const searchButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('🔍 Messages', `search_msg_${query}`),
                Markup.button.callback('👥 Users', `search_user_${query}`)
            ],
            [
                Markup.button.callback('📜 Files', `search_file_${query}`),
                Markup.button.callback('❌ Cancel', 'search_cancel')
            ]
        ]);
        
        await ctx.reply('🔍 Select search type:', searchButtons);
    });

    // Advanced Backup
    bot.command('backup', async (ctx) => {
        if (!await isAdmin(ctx)) return;
        
        const backupButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('📤 Export Settings', 'backup_settings'),
                Markup.button.callback('📥 Import Settings', 'backup_import')
            ],
            [
                Markup.button.callback('💾 Full Backup', 'backup_full'),
                Markup.button.callback('❌ Cancel', 'backup_cancel')
            ]
        ]);
        
        await ctx.reply('💾 Backup Options:', backupButtons);
    });
}; 