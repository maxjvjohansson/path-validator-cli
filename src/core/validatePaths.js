import fs from 'fs';
import path from 'path';
import { searchPaths } from './searchFiles.js';
import { parseHTML, parseCSS, parseJS, parsePHP } from '../utils/parsedContent.js';
import { errorMessages } from '../cli/messages.js';

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
        const lines = content.split('\n'); // Split file content into lines
        const parser = parsers[file.extension];

        if (parser) {
            const extractedPaths = parser(content, file.path, projectRoot);

            extractedPaths.invalidMatches.forEach(pathData => {
                const importPath = pathData.path;
                const fileDir = path.dirname(file.path); // Reference directory of the file
                let fullPath = path.resolve(fileDir, importPath);
                let issueType = null;
                let dynamicSuggestion = "";

                // Find the line number where the issue occurs
                const lineNumber = lines.findIndex(line => line.includes(importPath)) + 1;

                // Case 1: Flag absolute paths that may break after deployment
                if (importPath.startsWith('/')) {
                    issueType = "absolutePath";
                    let cleanPath = importPath.replace(/^\/+/, ""); // Remove leading `/`
                    let targetPath = path.join(projectRoot, cleanPath);
                    let relativePath = path.relative(fileDir, targetPath); // Calculate from `fileDir` → `targetPath`
                    
                    // Fix: Ensure shortest relative path possible
                    if (relativePath === '') {
                        relativePath = './'; // Same directory → use `./`
                    } else if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) {
                        relativePath = `./${relativePath}`;
                    } else if (relativePath.startsWith('../../')) {
                        relativePath = relativePath.replace(/^(\.\.\/)+/, '../'); // Avoid unnecessary deep levels
                    }

                    dynamicSuggestion = `Try a relative path instead: "${relativePath}"`;
                }

                // Case 2: Flag if the file does not exist
                else if (!fs.existsSync(fullPath)) {
                    issueType = "missingFile";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                }

                // Case 3: Flag relative paths that escape the project root
                else if (importPath.startsWith('..') && !fullPath.startsWith(projectRoot)) {
                    issueType = "tooManyBack";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                }

                // Case 4: Incorrect relative paths (e.g., `../` instead of `./`)
                else if (importPath.startsWith("./") || importPath.startsWith("../")) {
                    issueType = "incorrectRelative";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                }

                // Case 5: If no known issue type is found, flag as unknown
                else {
                    issueType = "unknownPath";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                }

                // Push the issue with the dynamically built suggestion
                if (issueType) {
                    invalidPaths.push({
                        ...pathData,
                        issue: issueType,
                        suggestion: dynamicSuggestion,
                        lineNumber // Include line number
                    });
                }
            });
        }
    }

    return { validPaths, invalidPaths };
}
