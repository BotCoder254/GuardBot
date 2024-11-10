const helpers = require('../utils/helpers');
const animations = require('../animations');

module.exports = (bot, storage) => {
    // Handle callback queries
    bot.action(/.*/, async (ctx) => {
        const action = ctx.match[0];
        const group = helpers.getGroup(storage, ctx.chat.id.toString());

        try {
            switch (action) {
                // Help and Info Actions
                case 'show_help':
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(getHelpMessage(), { parse_mode: 'Markdown' });
                    break;

                case 'show_about':
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(getAboutMessage(), { parse_mode: 'Markdown' });
                    break;

                case 'show_features':
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(getFeaturesMessage(), { parse_mode: 'Markdown' });
                    break;

                // Admin Panel Actions
                case 'toggle_spam':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    group.settings.antiSpam = !group.settings.antiSpam;
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(
                        `${animations.moderation.success[Math.floor(Math.random() * animations.moderation.success.length)]}\n\n` +
                        `Anti-spam has been ${group.settings.antiSpam ? 'enabled ✅' : 'disabled ❌'}`,
                        { parse_mode: 'Markdown' }
                    );
                    break;

                case 'toggle_links':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    group.settings.blockLinks = !group.settings.blockLinks;
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(
                        `${animations.moderation.success[Math.floor(Math.random() * animations.moderation.success.length)]}\n\n` +
                        `Link blocking has been ${group.settings.blockLinks ? 'enabled ✅' : 'disabled ❌'}`,
                        { parse_mode: 'Markdown' }
                    );
                    break;

                case 'manage_members':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(await getMemberManagementMessage(ctx, group), {
                        parse_mode: 'Markdown',
                        ...getMemberManagementButtons()
                    });
                    break;

                case 'show_settings':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(getSettingsMessage(group), {
                        parse_mode: 'Markdown',
                        ...getSettingsButtons()
                    });
                    break;

                case 'show_stats':
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(await getStatsMessage(ctx, group), {
                        parse_mode: 'Markdown',
                        ...getStatsButtons()
                    });
                    break;

                case 'toggle_fun':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    group.settings.funEnabled = !group.settings.funEnabled;
                    await ctx.answerCbQuery();
                    await ctx.editMessageText(
                        `${animations.moderation.success[Math.floor(Math.random() * animations.moderation.success.length)]}\n\n` +
                        `Fun mode has been ${group.settings.funEnabled ? 'enabled 🎮' : 'disabled ❌'}`,
                        { parse_mode: 'Markdown' }
                    );
                    break;

                // Security Actions
                case 'security_verify':
                case 'security_antibot':
                case 'security_links':
                case 'security_words':
                case 'security_raid':
                case 'security_autoban':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    await handleSecurityAction(ctx, action, group);
                    break;

                // Activity Actions
                case 'activity_detailed':
                case 'activity_graphs':
                case 'activity_rankings':
                case 'activity_live':
                    await handleActivityAction(ctx, action, group);
                    break;

                // Media Actions
                case 'media_images':
                case 'media_videos':
                case 'media_audio':
                case 'media_files':
                case 'media_settings':
                case 'media_stats':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    await handleMediaAction(ctx, action, group);
                    break;

                // Health Actions
                case 'health_detailed':
                case 'health_refresh':
                case 'health_optimize':
                case 'health_export':
                    if (!await helpers.isAdmin(ctx)) {
                        return ctx.answerCbQuery('⚠️ Admin only!');
                    }
                    await handleHealthAction(ctx, action, group);
                    break;

                default:
                    await ctx.answerCbQuery('⚠️ Action not implemented');
            }
        } catch (error) {
            console.error('Callback error:', error);
            ctx.answerCbQuery('❌ Error processing request');
        }
    });
};

// Helper functions for generating messages
function getHelpMessage() {
    return `
*📚 Help Menu*

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
}

function getAboutMessage() {
    return `
*About GuardianBot*

A powerful group management bot with advanced features:
• Group Management
• User Roles
• Analytics
• Security Features
• Media Controls
• And more...

Version: ${require('../config').BOT_VERSION}
    `;
}

function getFeaturesMessage() {
    return `
*✨ Bot Features*

🛡️ *Security*
• Anti-spam protection
• Link filtering
• Raid protection
• User verification

👮 *Moderation*
• Advanced warning system
• Customizable auto-mod
• Report handling
• Temporary bans

🎮 *Fun & Engagement*
• Welcome animations
• Interactive commands
• Polls and games
• Group statistics

⚙️ *Management*
• Customizable settings
• Admin control panel
• Activity tracking
• Broadcast messages
    `;
}

// Add more helper functions for other actions...
async function handleSecurityAction(ctx, action, group) {
    // Implementation for security actions
}

async function handleActivityAction(ctx, action, group) {
    // Implementation for activity actions
}

async function handleMediaAction(ctx, action, group) {
    // Implementation for media actions
}

async function handleHealthAction(ctx, action, group) {
    // Implementation for health actions
}

// Add more helper functions as needed...