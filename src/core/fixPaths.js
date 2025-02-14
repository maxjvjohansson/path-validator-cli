import fs from 'fs';
import path from 'path';
import { searchPaths } from './searchFiles.js';
import { validatePaths } from './validatePaths.js';

/**
 * Fixes invalid file paths by converting absolute to relative and correcting broken references.
 * @param {string} projectRoot - The root directory of the project.
 * @returns {Promise<void>}
 */
export async function fixPaths(projectRoot) {
    console.log('🔍 Running auto-correction for invalid paths...');

    // 1️⃣ Hämta alla ogiltiga sökvägar
    const { validPaths, invalidPaths } = await validatePaths(projectRoot);
    if (invalidPaths.length === 0) {
        console.log('✅ No invalid paths found!');
        return;
    }

    console.log(`🔎 Found ${invalidPaths.length} invalid paths. Attempting to fix...\n`);

    // 2️⃣ Hämta alla filer i projektet
    const allFiles = await searchPaths(projectRoot);
    const allFilePaths = allFiles.map(file => file.path);

    // 3️⃣ Loopa igenom och fixa varje ogiltig sökväg
    for (const pathData of invalidPaths) {
        const fileDir = path.dirname(pathData.file);
        let newPath = null;

        // 🟢 **Fall 1: Absolut sökväg som bör vara relativ**
        if (pathData.type === 'absolute') {
            newPath = path.relative(fileDir, pathData.path);
        }

        // 🔴 **Fall 2: Relativ sökväg som pekar på en saknad fil**
        else if (pathData.type === 'relative' && !fs.existsSync(path.resolve(fileDir, pathData.path))) {
            newPath = findCorrectPath(pathData.path, allFilePaths, fileDir);
        }

        // Om vi hittade en möjlig fix
        if (newPath) {
            console.log(`🔧 Fixing ${pathData.path} → ${newPath}`);
            await replacePathInFile(pathData.file, pathData.path, newPath);
        } else {
            console.log(`❌ No fix found for: ${pathData.path}`);
        }
    }

    console.log('✅ Path correction complete!');
}

/**
 * Tries to find a correct file path based on known project files.
 * @param {string} brokenPath - The incorrect path.
 * @param {string[]} allFilePaths - List of all file paths in the project.
 * @param {string} fileDir - The directory where the incorrect path is located.
 * @returns {string|null} - The corrected file path or null if no match found.
 */
function findCorrectPath(brokenPath, allFilePaths, fileDir) {
    const possibleMatches = allFilePaths.filter(filePath => filePath.includes(path.basename(brokenPath)));

    if (possibleMatches.length === 1) {
        return path.relative(fileDir, possibleMatches[0]); // Returnerar relativ sökväg om en bra match hittas
    }

    return null;
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

export function correctPath(filePath, projectRoot) {
    if (path.isAbsolute(filePath)) {
        if (filePath.startsWith(projectRoot)) {
            return path.relative(projectRoot, filePath);
        }
        return filePath;
    }
    return filePath;
}