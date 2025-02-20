import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import { validatePaths } from './validatePaths.js';
import { messages } from '../cli/messages.js';

export async function fixPaths(projectRoot) {

    // Get all invalid paths
    const { invalidPaths } = await validatePaths(projectRoot);
    let fixedCount = 0;

    // If no paths to fix, return directly
    if (invalidPaths.length === 0) {
        return { fixed: 0, message: messages.noInvalidPaths };
    }

    console.log(chalk.yellow(messages.foundInvalidPaths(invalidPaths.length)));

    // Loop through each invalid path and attempt to fix
    for (const pathData of invalidPaths) {
        const fileDir = path.dirname(pathData.file);
        let newPath = null;

        // Skip unknown paths
        if (pathData.issue === "unknownPath") {
            console.log(chalk.red(messages.cannotFix(pathData.path)));
            continue;
        }

        // Use suggested correction from `validatePaths.js`
        if (pathData.suggestion?.includes('Did you mean:')) {
            newPath = pathData.suggestion.match(/"([^"]+)"/)?.[1]; // Extract suggested path
        }

        // Convert absolute to relative
        else if (pathData.issue === "absolutePath") {
            let cleanPath = pathData.path.replace(/^\/+/, ""); // Remove leading `/`
            let targetPath = path.join(projectRoot, cleanPath);
            newPath = path.relative(fileDir, targetPath);

            if (newPath === '') {
                newPath = './';
            } else if (!newPath.startsWith('../') && !newPath.startsWith('./')) {
                newPath = `./${newPath}`;
            } else if (newPath.startsWith('../../')) {
                newPath = newPath.replace(/^(\.\.\/)+/, '../');
            }
        }

        // Apply fix
        if (newPath) {
            console.log(chalk.green(messages.fixingPath(pathData.path, newPath)));
            await replacePathInFile(pathData.file, pathData.path, newPath);
            fixedCount++;
        } else {
            console.log(chalk.red(messages.cannotFix(pathData.path)));
        }
    }

    // If no changes made, return directly
    if (fixedCount === 0) {
        return { fixed: 0, message: messages.noChanges };
    }

    // Fancy figlet output
    const successMessage = await new Promise((resolve) => {
        figlet.text('Complete', {
            font: 'block',
            horizontalLayout: 'full',
            verticalLayout: 'default'
        }, (err, data) => {
            resolve(err ? 'Complete' : data);
        });
    });

    console.log('\n' + chalk.white(successMessage));

    return { fixed: fixedCount, message: messages.fixComplete };
}

async function replacePathInFile(filePath, oldPath, newPath) {
    try {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const updatedContent = fileContent.replace(oldPath, newPath);
        await fs.promises.writeFile(filePath, updatedContent);
    } catch (error) {
        console.error(chalk.red(`❌ Failed to update file: ${filePath}`));
    }
}
