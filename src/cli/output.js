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

    console.log(chalk.hex('#CC0000').bold(`                                 ${invalidPaths.length} INVALID PATHS FOUND:\n`));

    invalidPaths.forEach(({ file, path, issue }) => {
        const error = errorMessages[issue] || { message: "Unknown error", suggestion: "" };

        if (issue === "missingFile") {
            console.log(
                `${chalk.bgRed.white('   MISSING FILE:   ')}        ${chalk.white(path)}\n\n` +
                `${chalk.yellow('   File referenced in:')}     ${chalk.white(file)}\n\n` +
                `${chalk.hex('#3AAFA9')('   Suggestion:')}             ${chalk.white(`"${error.suggestion}"`)}'\n\n` +
                chalk.gray('--------------------------------------------------------------------------------\n')
            );
        } else {
            console.log(
                `${chalk.red('   Invalid path in:')}          ${chalk.white(`${file}: '${path}'`)}\n\n` +
                `${chalk.yellow('   Error:')}                   ${chalk.white(`${error.message}: "${path}"`)}'\n\n` +
                `${chalk.cyan('   Suggestion:')}              ${chalk.white(`"${error.suggestion}"`)}'\n\n` +
                chalk.gray('--------------------------------------------------------------------------------\n')
            );
        }
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
