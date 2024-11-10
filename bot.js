const { Telegraf } = require('telegraf');
const config = require('./config');
const chalk = require('chalk');
const gradient = require('gradient-string');
const figlet = require('figlet');
require('dotenv').config();
const helpers = require('./utils/helpers');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Local Storage with better structure
const storage = {
    groups: new Map(),
    userStats: new Map(),
    messageCount: new Map(),
    cooldowns: new Map(),
    backups: new Map(),
    roles: new Map(),
    permissions: new Map()
};

// Display startup banner
function displayBanner() {
    return new Promise((resolve) => {
        figlet('GuardianBot', {
            font: 'Big',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function(err, data) {
            if (err) {
                console.log('Something went wrong with the banner...');
                resolve();
                return;
            }
            console.log(gradient.rainbow(data));
            console.log(gradient.pastel('━'.repeat(50)));
            console.log(chalk.cyan('Version: ') + chalk.yellow(config.BOT_VERSION));
            console.log(chalk.cyan('Status: ') + chalk.green('Initializing...'));
            console.log(gradient.pastel('━'.repeat(50)));
            resolve();
        });
    });
}

// Startup animation
async function displayStartupSequence() {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${chalk.cyan(frames[i])} Loading modules...`);
        i = (i + 1) % frames.length;
    }, 80);

    return interval;
}

// Add command handlers
require('./handlers/admin')(bot, storage);
require('./handlers/user')(bot, storage);
require('./handlers/games')(bot, storage);
require('./handlers/moderation')(bot, storage);
require('./handlers/features')(bot, storage);
require('./handlers/roles')(bot, storage);
require('./handlers/groupManagement')(bot, storage);

// Enhanced message handler
bot.on('message', async (ctx) => {
    try {
        const group = helpers.getGroup(storage, ctx.chat.id.toString());
        group.stats.messageCount++;
        group.stats.lastActive = Date.now();
        
        // Update user stats with roles
        const userId = ctx.from.id.toString();
        if (!storage.userStats.has(userId)) {
            storage.userStats.set(userId, {
                messageCount: 0,
                warnings: 0,
                joinDate: Date.now(),
                role: 'MEMBER'
            });
        }
        const userStats = storage.userStats.get(userId);
        userStats.messageCount++;
        
        // Process message with role-based permissions
        await require('./handlers/messageProcessor')(ctx, group, storage);
    } catch (error) {
        console.error('Message handling error:', error);
    }
});

// Add callback query handlers
require('./handlers/callbacks')(bot, storage);

// Error Handler
bot.catch((err, ctx) => {
    console.error(chalk.red(`Error for ${ctx.updateType}:`), err);
    ctx.reply('⚠️ An error occurred while processing your request.')
        .catch(e => console.error(chalk.red('Error sending error message:'), e));
});

// Startup sequence
async function startBot() {
    try {
        // Display banner
        await displayBanner();
        
        // Start loading animation
        const loadingAnimation = await displayStartupSequence();
        
        // Launch bot
        await bot.launch();
        
        // Stop loading animation
        clearInterval(loadingAnimation);
        
        // Clear the loading message
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        
        // Display success message
        console.log('\n' + gradient.rainbow('━'.repeat(50)));
        console.log(chalk.green('✓ Bot successfully deployed!'));
        console.log(chalk.cyan('Bot Username: ') + chalk.yellow('@' + (await bot.telegram.getMe()).username));
        console.log(chalk.cyan('Time: ') + chalk.yellow(new Date().toLocaleString()));
        console.log(chalk.cyan('Status: ') + chalk.green('Online'));
        console.log(gradient.rainbow('━'.repeat(50)));
        
        // Start periodic tasks
        require('./utils/tasks').startPeriodicTasks(storage);
        
    } catch (error) {
        console.error(chalk.red('✗ Failed to start bot:'), error);
        process.exit(1);
    }
}

// Handle shutdown
process.once('SIGINT', () => {
    console.log(chalk.yellow('\n⚠️ Shutting down...'));
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    console.log(chalk.yellow('\n⚠️ Shutting down...'));
    bot.stop('SIGTERM');
});

// Start the bot
startBot();

// For render.com deployment
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(port, () => {
    console.log(chalk.cyan(`\nWeb server running on port ${port}`));
});