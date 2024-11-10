const schedule = require('node-schedule');

function startPeriodicTasks(storage) {
    // Clear message counts every hour
    schedule.scheduleJob('0 * * * *', () => {
        storage.messageCount.clear();
    });

    // Reset daily stats at midnight
    schedule.scheduleJob('0 0 * * *', () => {
        for (const [groupId, group] of storage.groups) {
            if (group.stats) {
                group.stats.messageCount = 0;
                group.stats.mediaCount = 0;
                group.stats.spamAttempts = 0;
                group.stats.activeUsers = new Set();
            }
        }
    });

    // Backup data every 6 hours
    schedule.scheduleJob('0 */6 * * *', () => {
        // Implement backup logic here
        console.log('Periodic backup completed');
    });
}

module.exports = { startPeriodicTasks }; 