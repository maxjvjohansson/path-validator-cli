import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import { validatePaths } from './validatePaths.js';
import { messages } from '../cli/messages.js';

export async function fixPaths(projectRoot) {
    console.log(chalk.blue(messages.fixingPathsStart));

    // Get all invalid paths
    const { invalidPaths } = await validatePaths(projectRoot);
    if (invalidPaths.length === 0) {
        console.log(chalk.green(messages.noInvalidPaths));
        return { fixed: 0, message: messages.noInvalidPaths };
    }

    console.log(chalk.yellow(messages.foundInvalidPaths(invalidPaths.length)));

    let fixedCount = 0;

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
        if (pathData.suggestion?.includes('Did you mean:')) {
            newPath = pathData.suggestion.match(/"([^"]+)"/)?.[1]; // Extract suggested path
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
            fixedCount++;
        } else {
            console.log(chalk.red(messages.cannotFix(pathData.path)));
        }
    }

    console.log(chalk.green(messages.fixComplete));

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

    return {
        fixed: fixedCount,
        message: fixedCount > 0 ? messages.fixComplete : messages.noChanges
    };
}

function findCorrectPath(brokenPath, allFilePaths, fileDir) {
    const possibleMatches = allFilePaths.filter(filePath => filePath.includes(path.basename(brokenPath)));

    if (possibleMatches.length === 1) {
        return path.relative(fileDir, possibleMatches[0]); // Now correctly relative
    }

    return null; // No suitable match found
}

async function replacePathInFile(filePath, oldPath, newPath) {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const updatedContent = fileContent.replace(oldPath, newPath);
    await fs.promises.writeFile(filePath, updatedContent);
}

export function correctPath(filePath, projectRoot) {
    if (path.isAbsolute(filePath)) {
        if (filePath.startsWith(projectRoot)) {
            return path.relative(projectRoot, filePath);
        }
        return filePath;
    }
    return filePath;
}
