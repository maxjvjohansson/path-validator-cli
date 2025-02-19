import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { validatePaths } from './validatePaths.js';
import { messages } from '../cli/messages.js';

export async function fixPaths(projectRoot) {
    console.log(chalk.blue(messages.fixingPathsStart));

    // Get all invalid paths
    const { invalidPaths } = await validatePaths(projectRoot);
    if (invalidPaths.length === 0) {
        console.log(chalk.green(messages.noInvalidPaths));
        return;
    }

    console.log(chalk.yellow(messages.foundInvalidPaths(invalidPaths.length)));

    // Loop through each invalid path and apply the suggested fix
    for (const pathData of invalidPaths) {
        const fileDir = path.dirname(pathData.file);
        let newPath = null;

        // Skip fixing unknown paths
        if (pathData.issue === "unknownPath") {
            console.log(chalk.red(messages.cannotFix(pathData.path)));
            continue;
        }

        // Use the suggested corrected path from `validatePaths.js`
        if (pathData.suggestion.includes('Did you mean:')) {
            newPath = pathData.suggestion.match(/"([^"]+)"/)[1]; // Extract suggested path
        } 

        // If an absolute path needs to be converted to relative
        else if (pathData.issue === "absolutePath") {
            let cleanPath = pathData.path.replace(/^\/+/, ""); // Remove leading `/`
            let targetPath = path.join(projectRoot, cleanPath);
            newPath = path.relative(fileDir, targetPath); // Directly calculate from fileDir → targetPath
            
            // Ensure shortest relative path possible
            if (newPath === '') {
                newPath = './'; // Same directory → use `./`
            } else if (!newPath.startsWith('../') && !newPath.startsWith('./')) {
                newPath = `./${newPath}`;
            } else if (newPath.startsWith('../../')) {
                newPath = newPath.replace(/^(\.\.\/)+/, '../'); // Avoid unnecessary deep levels
            }
        }

        // If a valid fix is found, apply the correction
        if (newPath) {
            console.log(chalk.green(messages.fixingPath(pathData.path, newPath)));
            await replacePathInFile(pathData.file, pathData.path, newPath);
        } else {
            console.log(chalk.red(messages.cannotFix(pathData.path)));
        }
    }

    console.log(chalk.green(messages.fixComplete));
}

async function replacePathInFile(filePath, oldPath, newPath) {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const updatedContent = fileContent.replace(oldPath, newPath);
    await fs.promises.writeFile(filePath, updatedContent);
}
