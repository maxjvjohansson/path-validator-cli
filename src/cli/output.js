import chalk from 'chalk';
import { messages, errorMessages } from './messages.js';

// Loader animation for search
export function showSearchingMessage() {
    console.log(chalk.blue(messages.validationStart));
}

// Show result from validation
export function showResults(invalidPaths) {
    if (invalidPaths.length === 0) {
        console.log(chalk.green(messages.validationComplete(0)));
        return;
    }

    console.log(
        chalk.gray('\n================================================================================\n'),
        chalk.red(`\n                           ${invalidPaths.length} INVALID PATHS FOUND:\n`) +
        chalk.gray('\n================================================================================\n')
    );

    invalidPaths.forEach(({ file, path, issue, suggestion, lineNumber }) => {
        const error = errorMessages[issue] || { message: "Unknown error", suggestion: "" };
    
        console.log(
            `${chalk.bgRed.white('   Invalid Path:  ')}        ${chalk.white(`'${path}'`)}\n\n` +
            `${chalk.yellow('   File Referenced In:')}    ${chalk.white(file)}\n\n` +
            (lineNumber ? `${chalk.yellow('   Line Number:')}           ${chalk.white(lineNumber)}\n\n` : '') +
            `${chalk.hex('#3AAFA9')('   Suggestion:')}           ${chalk.white(` "${suggestion}"`)}\n\n` +
            chalk.gray('--------------------------------------------------------------------------------\n')
        );
    });

    console.log(chalk.yellow(messages.validationComplete(invalidPaths.length)));
}

// Show message if error is present
export function showErrorMessage(error) {
    console.log(chalk.red(messages.errorOccurred));
    console.error(error);
}

// Loader animation message
export function showFixingMessage() {
    console.log(chalk.blue(messages.fixingPaths));
}

// Message when all paths are fixed
export function showAllFixedMessage() {
    console.log(chalk.green(messages.allFixed));
}

// Message if no changes are made
export function showNoChangesMessage() {
    console.log(chalk.yellow(messages.noChanges));
}
