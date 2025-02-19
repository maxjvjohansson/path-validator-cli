import fs from 'fs';
import path from 'path';
import { searchPaths } from './searchFiles.js';
import { validatePaths } from './validatePaths.js';
import chalk from 'chalk';

/**
 * Fixes invalid file paths by converting absolute to relative and correcting broken references.
 * @param {string} projectRoot - The root directory of the project.
 * @returns {Promise<void>}
 */
export async function fixPaths(projectRoot) {
    console.log('🔍 Running auto-correction for invalid paths...\n');

    // 1️⃣ Get all invalid paths
    const { invalidPaths } = await validatePaths(projectRoot);
    if (invalidPaths.length === 0) {
        console.log('✅ No invalid paths found!');
        return;
    }

    console.log(`🔎 Found ${invalidPaths.length} invalid paths. Attempting to fix...\n`);

    // 2️⃣ Retrieve all project files
    const allFiles = await searchPaths(projectRoot);
    const allFilePaths = allFiles.map(file => file.path);

    // 3️⃣ Loop through each invalid path and attempt to fix
    for (const pathData of invalidPaths) {
        const fileDir = path.dirname(pathData.file);
        let newPath = null;

        // 🛑 Skip fixing missing files and unknown paths
        if (pathData.issue === "missingFile" || pathData.issue === "unknownPath") {
            console.log(`❌ Cannot fix ${chalk.red('(Manual fix required)')}: ${pathData.path}''`);
            continue;
        }
        // 🟢 Case 1: Convert absolute paths to the shortest possible relative path
        if (pathData.issue === "absolutePath") {
            let cleanPath = pathData.path.replace(/^\/+/, ""); // Remove leading `/`
            let targetPath = path.join(projectRoot, cleanPath);
            newPath = path.relative(fileDir, targetPath); // ✅ Directly calculate from fileDir → targetPath
            
            // 🔹 Fix: Ensure shortest relative path possible
            if (newPath === '') {
                newPath = './'; // Same directory → use `./`
            } else if (!newPath.startsWith('../') && !newPath.startsWith('./')) {
                newPath = `./${newPath}`;
            } else if (newPath.startsWith('../../')) {
                newPath = newPath.replace(/^(\.\.\/)+/, '../'); // Avoid unnecessary deep levels
            }
        }

        // 🟢 Case 2: Fix incorrectly formatted relative paths
        else if (pathData.issue === "incorrectRelative") {
            newPath = path.relative(fileDir, path.resolve(fileDir, pathData.path));
        }

        // 🔴 Case 3: If the file doesn't exist, attempt to find a correct match
        else if (!fs.existsSync(path.resolve(fileDir, pathData.path))) {
            newPath = findCorrectPath(pathData.path, allFilePaths, fileDir);
        }

        // ✅ If a valid fix is found, apply the correction
        if (newPath) {
            console.log(`🔧 Fixing ${pathData.path} → ${newPath}`);
            await replacePathInFile(pathData.file, pathData.path, newPath);
        } else {
            console.log(`❌ No fix found for: ${pathData.path}`);
        }
    }

    console.log('\n✅ Path correction complete!');
}

/**
 * Tries to find a correct file path based on known project files.
 * @param {string} brokenPath - The incorrect path.
 * @param {string[]} allFilePaths - List of all file paths in the project.
 * @param {string} fileDir - The directory where the incorrect path is located.
 * @returns {string|null} - The corrected file path or null if no match is found.
 */
function findCorrectPath(brokenPath, allFilePaths, fileDir) {
    const possibleMatches = allFilePaths.filter(filePath => filePath.includes(path.basename(brokenPath)));

    if (possibleMatches.length === 1) {
        return path.relative(fileDir, possibleMatches[0]); // ✅ Now correctly relative
    }

    return null; // No suitable match found
}

/**
 * Replaces an incorrect path in a file with a corrected path.
 * @param {string} filePath - The file to modify.
 * @param {string} oldPath - The incorrect path.
 * @param {string} newPath - The corrected path.
 * @returns {Promise<void>}
 */
async function replacePathInFile(filePath, oldPath, newPath) {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const updatedContent = fileContent.replace(oldPath, newPath);
    await fs.promises.writeFile(filePath, updatedContent);
}

/**
 * Converts an absolute path to a relative one if it belongs to the project root.
 * @param {string} filePath - The absolute path to convert.
 * @param {string} projectRoot - The root directory of the project.
 * @returns {string} - The converted relative path or the original path if unchanged.
 */
export function correctPath(filePath, projectRoot) {
    if (path.isAbsolute(filePath)) {
        if (filePath.startsWith(projectRoot)) {
            return path.relative(projectRoot, filePath);
        }
        return filePath;
    }
    return filePath;
}
