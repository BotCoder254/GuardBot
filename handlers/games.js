const animations = require('../animations');
const buttons = require('../buttons');

module.exports = (bot, storage) => {
    // Enhanced dice roll with animations
    bot.command('roll', async (ctx) => {
        const number = Math.floor(Math.random() * 6) + 1;
        const animation = animations.games.roll[Math.floor(Math.random() * animations.games.roll.length)]
            .replace('{result}', number);
        
        // Add special effects for 6 and 1
        let extra = '';
        if (number === 6) extra = '\n🎉 Perfect roll!';
        if (number === 1) extra = '\n😅 Better luck next time!';
        
        await ctx.reply(animation + extra);
    });

    // Enhanced coin flip with animations
    bot.command('flip', async (ctx) => {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const animation = animations.games.flip[Math.floor(Math.random() * animations.games.flip.length)]
            .replace('{result}', result);
        
        await ctx.reply(animation);
    });

    // Add more game commands here...
}; 