const { Markup } = require('telegraf');
const animations = require('../animations');

module.exports = (bot, storage) => {
    // Advanced Group Management Dashboard
    bot.command('dashboard', async (ctx) => {
        if (!await isAdmin(ctx)) return;
        
        const group = storage.groups.get(ctx.chat.id.toString());
        const memberCount = await ctx.getChatMembersCount();
        
        const dashboardMessage = `
🎛 *Group Dashboard*
${animations.loading[Math.floor(Math.random() * animations.loading.length)]}

*Group Status:*
├ Members: ${memberCount}
├ Messages Today: ${group?.stats?.messageCount || 0}
├ Active Hours: ${calculateActiveHours(group)}
└ Security Level: ${calculateSecurityLevel(group)}

*Quick Actions Available Below* ⬇️
        `;
        
        const dashboardButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('👥 Member Manager', 'members_manage'),
                Markup.button.callback('⚙️ Settings', 'settings_manage')
            ],
            [
                Markup.button.callback('🛡️ Security', 'security_manage'),
                Markup.button.callback('📊 Analytics', 'analytics_view')
            ],
            [
                Markup.button.callback('🎯 Activity', 'activity_view'),
                Markup.button.callback('🎮 Fun Settings', 'fun_manage')
            ]
        ]);
        
        await ctx.replyWithMarkdown(dashboardMessage, dashboardButtons);
    });

    // Enhanced Member Management
    bot.command('members', async (ctx) => {
        if (!await isAdmin(ctx)) return;
        
        const memberButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('🔍 Find Member', 'member_find'),
                Markup.button.callback('⚠️ Warned List', 'member_warned')
            ],
            [
                Markup.button.callback('🚫 Restricted', 'member_restricted'),
                Markup.button.callback('👑 Admins', 'member_admins')
            ],
            [
                Markup.button.callback('📊 Member Stats', 'member_stats'),
                Markup.button.callback('🎯 Active Users', 'member_active')
            ]
        ]);
        
        await ctx.reply('👥 *Member Management Panel*', {
            parse_mode: 'Markdown',
            ...memberButtons
        });
    });

    // Advanced Welcome Message Manager
    bot.command('welcome', async (ctx) => {
        if (!await isAdmin(ctx)) return;
        
        const welcomeButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('✏️ Edit Message', 'welcome_edit'),
                Markup.button.callback('🎨 Add Media', 'welcome_media')
            ],
            [
                Markup.button.callback('🎮 Add Games', 'welcome_games'),
                Markup.button.callback('🔄 Toggle Auto', 'welcome_toggle')
            ],
            [
                Markup.button.callback('📝 Preview', 'welcome_preview'),
                Markup.button.callback('❌ Cancel', 'welcome_cancel')
            ]
        ]);
        
        await ctx.reply('🎉 *Welcome Message Manager*', {
            parse_mode: 'Markdown',
            ...welcomeButtons
        });
    });

    // Enhanced Security Settings
    bot.command('security', async (ctx) => {
        if (!await isAdmin(ctx)) return;
        
        const securityButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('🔒 Verification', 'security_verify'),
                Markup.button.callback('🤖 Anti-Bot', 'security_antibot')
            ],
            [
                Markup.button.callback('🔗 Link Filter', 'security_links'),
                Markup.button.callback('📝 Word Filter', 'security_words')
            ],
            [
                Markup.button.callback('⚡ Raid Mode', 'security_raid'),
                Markup.button.callback('🛡️ Auto-Ban', 'security_autoban')
            ]
        ]);
        
        await ctx.reply('🔒 *Security Control Panel*', {
            parse_mode: 'Markdown',
            ...securityButtons
        });
    });

    // Activity Monitoring
    bot.command('activity', async (ctx) => {
        if (!await isAdmin(ctx)) return;
        
        const group = storage.groups.get(ctx.chat.id.toString());
        const activityStats = calculateActivityStats(group);
        
        const activityMessage = `
📊 *Activity Report*

*Today's Statistics:*
├ Messages: ${activityStats.messages}
├ Active Users: ${activityStats.activeUsers}
├ Peak Hour: ${activityStats.peakHour}
└ Engagement: ${activityStats.engagement}%

*Top Users Today:*
${activityStats.topUsers.map((user, i) => 
    `${i + 1}. ${user.name}: ${user.messages} msgs`
).join('\n')}
        `;
        
        const activityButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('📈 Detailed Stats', 'activity_detailed'),
                Markup.button.callback('📊 Graphs', 'activity_graphs')
            ],
            [
                Markup.button.callback('🎯 User Rankings', 'activity_rankings'),
                Markup.button.callback('⚡ Live Activity', 'activity_live')
            ]
        ]);
        
        await ctx.replyWithMarkdown(activityMessage, activityButtons);
    });
};

// Helper Functions
function calculateActiveHours(group) {
    // Implementation for calculating active hours
    return group?.stats?.activeHours || '24/7';
}

function calculateSecurityLevel(group) {
    let level = 0;
    if (group?.antiSpam) level += 2;
    if (group?.blockLinks) level += 2;
    if (group?.verification) level += 1;
    if (group?.antiBot) level += 2;
    if (group?.wordFilter) level += 1;
    if (group?.raidMode) level += 2;
    
    const levels = ['🟢 Low', '🟡 Medium', '🟠 High', '🔴 Maximum'];
    return levels[Math.min(Math.floor(level/3), 3)];
}

function calculateActivityStats(group) {
    return {
        messages: group?.stats?.messageCount || 0,
        activeUsers: group?.stats?.activeUsers?.size || 0,
        peakHour: group?.stats?.peakHour || 'N/A',
        engagement: group?.stats?.engagement || 0,
        topUsers: group?.stats?.topUsers || []
    };
} 