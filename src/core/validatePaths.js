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

            for (const pathData of extractedPaths.invalidMatches) {
                const importPath = pathData.path;

                let fullPath = path.resolve(path.dirname(file.path), importPath);

                // Flag absolute paths that will not work deployed
                if (importPath.startsWith('/')) {
                    const possibleRelativePath = path.relative(file.path, fullPath);

                    // Flag if file exists in projectroot but not in webroot
                    if (!fs.existsSync(fullPath)) {
                        invalidPaths.push({
                            ...pathData,
                            issue: 'Absolute path will not work after deployment',
                            suggestion: `Use relative path: ${possibleRelativePath}`
                        });
                    }
                    continue;
                }

                // Flag relative paths that escapes project root
                if (importPath.startsWith('..')) {
                    const outsideProject = !fullPath.startsWith(projectRoot);
                    if (outsideProject) {
                        invalidPaths.push({
                            ...pathData,
                            issue: 'Relative path escapes project root',
                            suggestion: `Reconsider path: ${importPath}`
                        });
                    }
                    continue;
                }

                // Flag if relative path doesn't point to an actual file
                if (!fs.existsSync(fullPath)) {
                    invalidPaths.push({
                        ...pathData,
                        issue: 'File does not exist',
                        suggestion: `Check if ${importPath} should be ${path.relative(path.dirname(file.path), fullPath)}`
                    });
                    continue;
                }

                validPaths.push(pathData);
            }
        }
    }

    return { validPaths, invalidPaths };
}