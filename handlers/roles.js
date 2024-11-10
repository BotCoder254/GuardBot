const { Markup } = require('telegraf');
const animations = require('../animations');

module.exports = (bot, storage) => {
    // Role definitions
    const ROLES = {
        OWNER: {
            level: 100,
            name: '👑 Owner',
            permissions: ['all']
        },
        ADMIN: {
            level: 80,
            name: '⚡ Admin',
            permissions: ['manage_users', 'manage_messages', 'manage_settings']
        },
        MODERATOR: {
            level: 60,
            name: '🛡️ Moderator',
            permissions: ['delete_messages', 'warn_users', 'mute_users']
        },
        HELPER: {
            level: 40,
            name: '💫 Helper',
            permissions: ['delete_messages', 'report_users']
        },
        VIP: {
            level: 20,
            name: '⭐ VIP',
            permissions: ['send_media', 'send_links']
        },
        MEMBER: {
            level: 0,
            name: '👤 Member',
            permissions: ['send_messages']
        }
    };

    // Role Management Commands
    bot.command('roles', async (ctx) => {
        if (!await isAdmin(ctx)) return;

        const roleButtons = Markup.inlineKeyboard([
            [
                Markup.button.callback('➕ Add Role', 'role_add'),
                Markup.button.callback('🔄 Edit Role', 'role_edit')
            ],
            [
                Markup.button.callback('👥 View Roles', 'role_view'),
                Markup.button.callback('🎯 Assign Role', 'role_assign')
            ],
            [
                Markup.button.callback('⚙️ Role Settings', 'role_settings'),
                Markup.button.callback('📊 Role Stats', 'role_stats')
            ]
        ]);

        const message = `
🎭 *Role Management System*
${animations.dashboard.loading[Math.floor(Math.random() * animations.dashboard.loading.length)]}

*Available Roles:*
${Object.entries(ROLES).map(([key, role]) => 
    `${role.name} (Level ${role.level})`
).join('\n')}

*Select an action below:*
        `;

        await ctx.replyWithMarkdown(message, roleButtons);
    });

    // Assign Role Command
    bot.command('assign', async (ctx) => {
        if (!await isAdmin(ctx)) return;
        if (!ctx.message.reply_to_message) {
            return ctx.reply('⚠️ Reply to a user to assign a role!');
        }

        const roleButtons = Markup.inlineKeyboard(
            Object.entries(ROLES).map(([key, role]) => [
                Markup.button.callback(role.name, `assign_${key.toLowerCase()}_${ctx.message.reply_to_message.from.id}`)
            ])
        );

        await ctx.reply('Select role to assign:', roleButtons);
    });

    // Role Information Command
    bot.command('roleinfo', async (ctx) => {
        const userId = ctx.message.reply_to_message?.from.id || ctx.from.id;
        const userRole = getUserRole(ctx.chat.id, userId);
        const role = ROLES[userRole] || ROLES.MEMBER;

        const message = `
👤 *User Role Information*

*User:* ${ctx.message.reply_to_message?.from.first_name || ctx.from.first_name}
*Current Role:* ${role.name}
*Level:* ${role.level}

*Permissions:*
${role.permissions.map(perm => `• ${formatPermission(perm)}`).join('\n')}
        `;

        await ctx.replyWithMarkdown(message);
    });

    // Handle role assignments
    bot.action(/assign_(.+)_(\d+)/, async (ctx) => {
        const [role, userId] = ctx.match.slice(1);
        if (!await isAdmin(ctx)) return;

        try {
            await assignRole(ctx.chat.id, userId, role.toUpperCase());
            await ctx.answerCbQuery(
                `${animations.effects.sparkles} Role assigned successfully!`
            );
            await ctx.editMessageText(
                `${animations.moderation.success[Math.floor(Math.random() * animations.moderation.success.length)]}\n\nRole ${ROLES[role.toUpperCase()].name} assigned to user!`
            );
        } catch (error) {
            await ctx.answerCbQuery('Failed to assign role!');
        }
    });

    // Helper functions
    function getUserRole(chatId, userId) {
        const group = storage.groups.get(chatId.toString());
        return group?.roles?.[userId] || 'MEMBER';
    }

    function assignRole(chatId, userId, role) {
        const group = storage.groups.get(chatId.toString()) || {
            roles: {},
            stats: {}
        };
        group.roles = group.roles || {};
        group.roles[userId] = role;
        storage.groups.set(chatId.toString(), group);
    }

    function formatPermission(perm) {
        return perm
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Role verification middleware
    bot.use(async (ctx, next) => {
        if (ctx.chat?.type.includes('group')) {
            const userId = ctx.from.id;
            const userRole = getUserRole(ctx.chat.id, userId);
            const role = ROLES[userRole];

            ctx.state.userRole = role;
            ctx.state.hasPermission = (permission) => {
                return role.permissions.includes(permission) || role.permissions.includes('all');
            };
        }
        return next();
    });
}; 