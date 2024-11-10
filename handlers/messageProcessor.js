const helpers = require('../utils/helpers');
const animations = require('../animations');

module.exports = async (ctx, group, storage) => {
    try {
        // Initialize group settings if not exists
        group.settings = group.settings || {
            blockLinks: true,
            blockMedia: true,
            maxWarnings: 3,
            muteHours: 12
        };

        group.warnings = group.warnings || new Map();
        
        // Update message history
        group.messageHistory = group.messageHistory || [];
        group.messageHistory.push({
            userId: ctx.from.id,
            type: getMessageType(ctx.message),
            text: ctx.message.text,
            timestamp: Date.now()
        });

        // Limit history size
        if (group.messageHistory.length > 1000) {
            group.messageHistory = group.messageHistory.slice(-1000);
        }

        // Update active users
        group.stats.activeUsers = group.stats.activeUsers || new Set();
        group.stats.activeUsers.add(ctx.from.id);

        // Check if user is admin
        const isAdmin = await helpers.isAdmin(ctx);
        if (isAdmin) return; // Skip checks for admins

        // Check for links
        if (group.settings.blockLinks && containsLink(ctx.message)) {
            await handleViolation(ctx, group, 'link');
            return;
        }

        // Check for media
        if (group.settings.blockMedia && isMedia(ctx.message)) {
            await handleViolation(ctx, group, 'media');
            return;
        }

        // Update media count if allowed
        if (isMedia(ctx.message)) {
            group.stats.mediaCount = (group.stats.mediaCount || 0) + 1;
        }

    } catch (error) {
        console.error('Error processing message:', error);
    }
};

async function handleViolation(ctx, group, type) {
    const userId = ctx.from.id.toString();
    const currentWarnings = (group.warnings.get(userId) || 0) + 1;
    group.warnings.set(userId, currentWarnings);

    // Delete the message
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.error('Error deleting message:', error);
    }

    // Select warning message
    const warningMessage = type === 'link' 
        ? `⚠️ ${ctx.from.first_name}, links are not allowed!`
        : `⚠️ ${ctx.from.first_name}, media sharing is restricted!`;

    // Send warning message
    const warning = await ctx.reply(
        `${warningMessage}\nWarning ${currentWarnings}/${group.settings.maxWarnings}`
    );

    // Auto-delete warning message after 5 seconds
    setTimeout(() => ctx.deleteMessage(warning.message_id), 5000);

    // Check if max warnings exceeded
    if (currentWarnings >= group.settings.maxWarnings) {
        try {
            // Calculate mute duration
            const muteUntil = Math.floor(Date.now() / 1000) + (group.settings.muteHours * 3600);
            
            // Mute the user
            await ctx.restrictChatMember(userId, {
                until_date: muteUntil,
                can_send_messages: false,
                can_send_media_messages: false,
                can_send_other_messages: false,
                can_add_web_page_previews: false
            });

            // Send mute notification
            const muteMessage = await ctx.reply(
                `${animations.moderation.action[Math.floor(Math.random() * animations.moderation.action.length)]}\n\n` +
                `👤 User: ${ctx.from.first_name}\n` +
                `🚫 Action: Muted\n` +
                `⏰ Duration: ${group.settings.muteHours} hours\n` +
                `📝 Reason: Exceeded maximum warnings\n\n` +
                `⚠️ Warnings will be reset after the mute period.`
            );

            // Reset warnings after mute
            group.warnings.set(userId, 0);

            // Auto-delete mute notification after 10 seconds
            setTimeout(() => ctx.deleteMessage(muteMessage.message_id), 10000);

        } catch (error) {
            console.error('Error muting user:', error);
        }
    }

    // Update stats
    group.stats.warningsIssued = (group.stats.warningsIssued || 0) + 1;
}

function getMessageType(message) {
    if (message.photo) return 'photo';
    if (message.video) return 'video';
    if (message.audio) return 'audio';
    if (message.voice) return 'voice';
    if (message.sticker) return 'sticker';
    if (message.document) return 'document';
    return 'text';
}

function isMedia(message) {
    return ['photo', 'video', 'audio', 'voice', 'document', 'sticker'].some(
        type => message[type]
    );
}

function containsLink(message) {
    if (!message.text) return false;
    const linkPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(t\.me\/[^\s]+)|(@[^\s]+)/gi;
    return linkPattern.test(message.text);
} 