import fs from 'fs';
import path from 'path';
import { searchPaths } from './searchFiles.js';
import { parseHTML, parseCSS, parseJS, parsePHP } from '../utils/parsedContent.js';
import { errorMessages } from '../cli/messages.js';

export async function validatePaths(projectRoot) {
    const allProjectFiles = await searchPaths(projectRoot);
    const projectFilePaths = allProjectFiles.map(file => file.path);
    const searchedFiles = allProjectFiles.filter(file => ['.html', '.css', '.js', '.php'].includes(file.extension));

    const validPaths = [];
    const invalidPaths = [];

    const parsers = {
        '.html': parseHTML,
        '.css': parseCSS,
        '.js': parseJS,
        '.php': parsePHP
    };

    for (const file of searchedFiles) {
        const content = await fs.promises.readFile(file.path, 'utf-8');
        const lines = content.split('\n');
        const parser = parsers[file.extension];

        if (parser) {
            const extractedPaths = parser(content, file.path, projectRoot);

            extractedPaths.invalidMatches.forEach(pathData => {
                const importPath = pathData.path;
                const fileDir = path.dirname(file.path);
                let fullPath = path.resolve(fileDir, importPath);
                let issueType = null;
                let dynamicSuggestion = "";

                // Find the line number where the issue occurs
                const lineNumber = lines.findIndex(line => line.includes(importPath)) + 1;

                // Case 1: Absolute paths that may break after deployment
                if (importPath.startsWith('/')) {
                    issueType = "absolutePath";
                    let cleanPath = importPath.replace(/^\/+/, "");
                    let targetPath = path.join(projectRoot, cleanPath);
                    let relativePath = path.relative(fileDir, targetPath);

                    if (relativePath === '') relativePath = './';
                    else if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) relativePath = `./${relativePath}`;
                    else if (relativePath.startsWith('../../')) relativePath = relativePath.replace(/^(\.\.\/)+/, '../');

                    dynamicSuggestion = errorMessages[issueType].suggestion(relativePath);
                }

                // Case 2: Missing files → Check if the file exists elsewhere in the project
                else if (!fs.existsSync(fullPath)) {
                    issueType = "missingFile";

                    // Try to find the correct path instead of just saying "File does not exist"
                    const correctRelativePath = findCorrectPath(importPath, projectFilePaths, fileDir);

                    dynamicSuggestion = errorMessages[issueType].suggestion(correctRelativePath);
                }

                // Case 3: Relative paths that escape project root
                else if (importPath.startsWith('..') && !fullPath.startsWith(projectRoot)) {
                    issueType = "tooManyBack";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                }

                // Case 4: Incorrect relative paths
                else if (importPath.startsWith("./") || importPath.startsWith("../")) {
                    issueType = "incorrectRelative";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                }

                // Case 5: Unknown path issue
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
                        lineNumber
                    });
                }
            });
        }
    }

    return { validPaths, invalidPaths };
}

function findCorrectPath(brokenPath, projectFilePaths, fileDir) {
    const filename = path.basename(brokenPath);
    
    // Find all occurrences of the file in the project
    const possibleMatches = projectFilePaths.filter(filePath => filePath.endsWith(filename));

    if (possibleMatches.length === 1) {
        return path.relative(fileDir, possibleMatches[0]); // Return correct relative path
    } 
    
    if (possibleMatches.length > 1) {
        // Multiple matches found, return the closest match
        return possibleMatches
            .map(match => ({
                path: match,
                distance: path.relative(fileDir, match).split(path.sep).length
            }))
            .sort((a, b) => a.distance - b.distance)[0].path;
    }

    return null; // No suitable match found
}
