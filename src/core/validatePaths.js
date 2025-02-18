import fs from 'fs';
import path from 'path';
import { searchPaths } from './searchFiles.js';
import { parseHTML, parseCSS, parseJS, parsePHP } from '../utils/parsedContent.js';

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

            extractedPaths.invalidMatches.forEach(pathData => {
                const importPath = pathData.path;
                let fullPath = path.resolve(path.dirname(file.path), importPath);

                // Case 1: Flag absolute paths that may break after deployment
                if (importPath.startsWith('/')) {
                    pathData.issue = "absolutePath";
                    invalidPaths.push({
                        ...pathData,
                        suggestion: `Use a relative path instead: ${path.relative(file.path, fullPath)}`
                    });
                    return;
                }

                // Case 2: Flag if the file does not exist
                if (!fs.existsSync(fullPath)) {
                    pathData.issue = "missingFile";
                    invalidPaths.push({
                        ...pathData,
                        suggestion: "Check if the file was moved or renamed manually."
                    });
                    return;
                }

                // Case 3: Flag relative paths that escape the project root
                if (importPath.startsWith('..') && !fullPath.startsWith(projectRoot)) {
                    pathData.issue = "tooManyBack";
                    invalidPaths.push({
                        ...pathData,
                        suggestion: "Adjust the path to stay within the project root."
                    });
                    return;
                }

                // Case 4: Incorrect relative paths (e.g., `../` instead of `./`)
                if (importPath.startsWith("./") || importPath.startsWith("../")) {
                    pathData.issue = "incorrectRelative";
                    invalidPaths.push({
                        ...pathData,
                        suggestion: "Try './' instead of '../' if the file is in the same folder."
                    });
                    return;
                }

                // Case 5: If no known issue type is found, flag as unknown
                pathData.issue = "unknownPath";
                invalidPaths.push({
                    ...pathData,
                    suggestion: "This path could not be classified. Please check manually."
                });
            });
        }
    }

    return { validPaths, invalidPaths };
}
