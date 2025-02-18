import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { searchPaths } from './searchFiles.js';
import { validatePaths } from './validatePaths.js';
import { messages } from '../cli/messages.js';

export async function fixPaths(projectRoot) {
    console.log(chalk.blue(messages.fixingPathsStart)); // 

    // Get all invalid paths
    const { invalidPaths } = await validatePaths(projectRoot);
    if (invalidPaths.length === 0) {
        console.log(chalk.green(messages.noInvalidPaths)); 
        return;
    }

    console.log(chalk.yellow(messages.foundInvalidPaths(invalidPaths.length)));

    // Retrieve all project files
    const allFiles = await searchPaths(projectRoot);
    const allFilePaths = allFiles.map(file => file.path);

    // Loop through each invalid path and attempt to fix
    for (const pathData of invalidPaths) {
        const fileDir = path.dirname(pathData.file);
        let newPath = null;

        // Skip fixing missing files and unknown paths
        if (pathData.issue === "missingFile" || pathData.issue === "unknownPath") {
            console.log(chalk.red(messages.cannotFix(pathData.path)));
            continue;
        }

        // Case 1: Convert absolute paths to the shortest possible relative path
        if (pathData.issue === "absolutePath") {
            let cleanPath = pathData.path.replace(/^\/+/, ""); // Remove leading `/`
            let targetPath = path.join(projectRoot, cleanPath);
            newPath = path.relative(fileDir, targetPath); // Calculate from fileDir → targetPath
            
            // Fix: Ensure shortest relative path possible
            if (newPath === '') {
                newPath = './'; // Same directory → use `./`
            } else if (!newPath.startsWith('../') && !newPath.startsWith('./')) {
                newPath = `./${newPath}`;
            } else if (newPath.startsWith('../../')) {
                newPath = newPath.replace(/^(\.\.\/)+/, '../'); // Avoid unnecessary deep levels
            }
        }

        // Case 2: Fix incorrectly formatted relative paths
        else if (pathData.issue === "incorrectRelative") {
            newPath = path.relative(fileDir, path.resolve(fileDir, pathData.path));
        }

        // Case 3: If the file doesn't exist, attempt to find a correct match
        else if (!fs.existsSync(path.resolve(fileDir, pathData.path))) {
            newPath = findCorrectPath(pathData.path, allFilePaths, fileDir);
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
