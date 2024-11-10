const { Markup } = require('telegraf');

module.exports = {
    startButtons: () => Markup.inlineKeyboard([
        [
            Markup.button.callback('📚 Help', 'show_help'),
            Markup.button.callback('✨ Features', 'show_features')
        ],
        [
            Markup.button.callback('👥 About', 'show_about'),
            Markup.button.callback('⚙️ Settings', 'show_settings')
        ]
    ]),

    adminButtons: () => Markup.inlineKeyboard([
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
        ],
        [
            Markup.button.callback('🛡️ Security', 'security_settings'),
            Markup.button.callback('📢 Broadcasts', 'broadcast_menu')
        ]
    ]),

    welcomeButtons: () => Markup.inlineKeyboard([
        [
            Markup.button.callback('📜 Rules', 'show_rules'),
            Markup.button.callback('ℹ️ Info', 'show_info')
        ],
        [
            Markup.button.callback('📊 Stats', 'show_stats'),
            Markup.button.callback('🎮 Games', 'show_games')
        ]
    ]),

    gameButtons: () => Markup.inlineKeyboard([
        [
            Markup.button.callback('🎲 Roll Dice', 'game_roll'),
            Markup.button.callback('🪙 Flip Coin', 'game_flip')
        ],
        [
            Markup.button.callback('🎯 Random Number', 'game_random'),
            Markup.button.callback('🎮 More Games', 'show_more_games')
        ]
    ])
}; 