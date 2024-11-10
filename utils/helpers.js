const isAdmin = async (ctx) => {
    try {
        if (!ctx.chat?.type.includes('group')) return false;
        const member = await ctx.telegram.getChatMember(
            ctx.chat.id,
            ctx.from.id
        );
        return ['creator', 'administrator'].includes(member.status);
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

const getGroup = (storage, groupId) => {
    if (!storage.groups.has(groupId)) {
        storage.groups.set(groupId, {
            stats: {
                messageCount: 0,
                mediaCount: 0,
                activeUsers: new Set(),
                spamAttempts: 0,
                warningsIssued: 0,
                bannedCount: 0,
                lastActive: Date.now(),
                activityScore: 100,
                messageFlowScore: 100,
                engagementScore: 100
            },
            settings: {
                antiSpam: true,
                blockLinks: true,
                welcomeEnabled: true,
                mediaRestrictions: false
            },
            roles: {},
            warnings: new Map(),
            messageHistory: []
        });
    }
    return storage.groups.get(groupId);
};

const calculatePeakHours = (group) => {
    const hours = new Array(24).fill(0);
    group.messageHistory?.forEach(msg => {
        const hour = new Date(msg.timestamp).getHours();
        hours[hour]++;
    });
    
    return hours
        .map((count, hour) => ({ time: `${hour}:00`, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
};

const getTopUsers = (group) => {
    const userCounts = new Map();
    group.messageHistory?.forEach(msg => {
        const count = userCounts.get(msg.userId) || 0;
        userCounts.set(msg.userId, count + 1);
    });
    
    return Array.from(userCounts.entries())
        .map(([userId, count]) => ({
            name: getUserName(userId) || userId,
            messages: count
        }))
        .sort((a, b) => b.messages - a.messages)
        .slice(0, 5);
};

const analyzeContent = (group) => {
    const content = {
        text: 0,
        media: 0,
        links: 0,
        stickers: 0
    };
    
    group.messageHistory?.forEach(msg => {
        if (msg.type === 'text') content.text++;
        if (msg.type === 'media') content.media++;
        if (msg.type === 'sticker') content.stickers++;
        if (msg.text?.includes('http')) content.links++;
    });
    
    return content;
};

const getMemberStats = async (ctx, group) => {
    try {
        const currentMembers = await ctx.telegram.getChatMembersCount(ctx.chat.id);
        return {
            new: group.stats.newMembers || 0,
            left: group.stats.leftMembers || 0,
            active: group.stats.activeUsers?.size || 0,
            inactive: currentMembers - (group.stats.activeUsers?.size || 0)
        };
    } catch (error) {
        console.error('Error getting member stats:', error);
        return {
            new: 0,
            left: 0,
            active: 0,
            inactive: 0
        };
    }
};

module.exports = {
    isAdmin,
    getGroup,
    calculatePeakHours,
    getTopUsers,
    analyzeContent,
    getMemberStats
}; 