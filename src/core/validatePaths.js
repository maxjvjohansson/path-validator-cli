import fs from 'fs';
import path from 'path';
import { searchPaths } from './searchFiles.js';
import { parseHTML, parseCSS, parseJS, parsePHP } from '../utils/parser.js';

/**
 * Validate extracted paths to check if they exist in the project or are valid URLs.
 * @param {string} projectRoot - The root directory of the project.
 * @returns {Promise<Object>} Object containing valid and invalid paths.
 */
export async function validatePaths(projectRoot) {
    const files = await searchPaths(projectRoot);

    const validPaths = [];
    const invalidPaths = [];

    const parsers = {
        '.html': parseHTML,
        '.css': parseCSS,
        '.js': parseJS,
        '.php': parsePHP
    };

    for (const file of files) {
        const content = await fs.promises.readFile(file.path, 'utf-8');
        const parser = parsers[file.extension];

        if (parser) {
            const extractedPaths = parser(content, file.path, projectRoot);

            for (const pathData of extractedPaths.invalidMatches) {
                let fullPath = pathData.path;
                if (pathData.type === 'relative') {
                    fullPath = path.resolve(path.dirname(file.path), pathData.path);
                }

                if (fs.existsSync(fullPath)) {
                    validPaths.push(pathData);
                } else {
                    invalidPaths.push(pathData);
                }
            }
        }
    }

    return { validPaths, invalidPaths };
}