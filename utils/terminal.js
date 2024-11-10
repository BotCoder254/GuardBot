const chalk = require('chalk');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const terminalArt = {
    logo: `
    ████████╗██████╗  ██████╗     ██████╗  ██████╗ ████████╗
    ╚══██╔══╝██╔══██╗██╔════╝     ██╔══██╗██╔═══██╗╚══██╔══╝
       ██║   ██████╔╝██║  ███╗    ██████╔╝██║   ██║   ██║   
       ██║   ██╔══██╗██║   ██║    ██╔══██╗██║   ██║   ██║   
       ██║   ██║  ██║╚██████╔╝    ██████╔╝╚██████╔╝   ██║   
       ╚═╝   ╚═╝  ╚═╝ ╚═════╝     ╚═════╝  ╚═════╝    ╚═╝   
    `,
    
    frame1: `
    ╔════════════════════════════════════╗
    ║         INITIALIZING...            ║
    ╚════════════════════════════════════╝
    `,
    
    frame2: `
    ╔════════════════════════════════════╗
    ║         CONNECTING...              ║
    ╚════════════════════════════════════╝
    `,
    
    frame3: `
    ╔════════════════════════════════════╗
    ║         LOADING MODULES...         ║
    ╚════════════════════════════════════╝
    `
};

async function displayStartupAnimation() {
    console.clear();
    
    // Display logo
    console.log(chalk.cyan(terminalArt.logo));
    await sleep(1000);
    
    // Loading animation
    console.log(chalk.yellow(terminalArt.frame1));
    await sleep(500);
    console.clear();
    console.log(chalk.cyan(terminalArt.logo));
    console.log(chalk.yellow(terminalArt.frame2));
    await sleep(500);
    console.clear();
    console.log(chalk.cyan(terminalArt.logo));
    console.log(chalk.yellow(terminalArt.frame3));
    await sleep(500);
    
    // Final status display
    console.clear();
    const statusDisplay = `
    ${chalk.cyan(terminalArt.logo)}
    ${chalk.green('╔════════════════════════════════════╗')}
    ${chalk.green('║')}         ${chalk.white.bold('BOT STATUS')}              ${chalk.green('║')}
    ${chalk.green('╠════════════════════════════════════╣')}
    ${chalk.green('║')} ${chalk.white('Name:')}    ${chalk.cyan('GuardianBot 🛡️')}          ${chalk.green('║')}
    ${chalk.green('║')} ${chalk.white('Version:')} ${chalk.yellow('2.1.0')}                  ${chalk.green('║')}
    ${chalk.green('║')} ${chalk.white('Status:')}  ${chalk.green('ONLINE ✓')}               ${chalk.green('║')}
    ${chalk.green('║')} ${chalk.white('Time:')}    ${new Date().toLocaleString()}  ${chalk.green('║')}
    ${chalk.green('╚════════════════════════════════════╝')}
    
    ${chalk.yellow('📝 Logs:')}
    `;
    
    console.log(statusDisplay);
}

module.exports = { displayStartupAnimation }; 