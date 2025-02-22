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

    const seenInvalidPaths = new Set();

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
     
                // Avoid duplicated path flagging
                const uniqueKey = `${file.path}:${importPath}`;
                if (seenInvalidPaths.has(uniqueKey)) {
                    return; // Exit if already flagged once
                }
                seenInvalidPaths.add(uniqueKey);
     
                // Find the correct line number for each issue
                const lineNumber = lines.findIndex(line => line.includes(importPath)) + 1;

                if (importPath.startsWith('./')) {
                    const fullRelativePath = path.resolve(fileDir, importPath);
                    if (fs.existsSync(fullRelativePath)) {
                        validPaths.push({
                            path: importPath,
                            sourceFile: file.path,
                            lineNumber
                        });
                        return; // Return if it's already correctly relative
                    }
                }
     
                // Identify possible path problems
                if (importPath.startsWith('/')) {
                    issueType = "absolutePath";
                    let cleanPath = importPath.replace(/^\/+/, "");
                    let fileDirectory = path.dirname(file.path);
                    
                    let parentDir = path.dirname(fileDirectory);
                    while (parentDir !== projectRoot && path.basename(parentDir) !== path.basename(path.dirname(fileDirectory))) {
                        parentDir = path.dirname(parentDir);
                    }
                    let targetPath = path.join(parentDir, cleanPath);
                    if (!fs.existsSync(targetPath)) {
                        targetPath = path.join(projectRoot, cleanPath);
                    }
                    
                    let relativePath = path.relative(fileDirectory, targetPath);
                    if (!relativePath.startsWith('.')) {
                        relativePath = `./${relativePath}`;
                    }                    
                    dynamicSuggestion = errorMessages[issueType].suggestion(relativePath);
                } else if (!fs.existsSync(fullPath)) {
                    issueType = "missingFile";
                    const correctRelativePath = findCorrectPath(importPath, projectFilePaths, fileDir);
                    dynamicSuggestion = errorMessages[issueType].suggestion(correctRelativePath);
                } else if (importPath.startsWith('..') && !fullPath.startsWith(projectRoot)) {
                    issueType = "tooManyBack";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                } else if (importPath.startsWith("../")) {
                    issueType = "incorrectRelative";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                } else {
                    issueType = "unknownPath";
                    dynamicSuggestion = errorMessages[issueType].suggestion;
                }
     
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
    const possibleMatches = projectFilePaths.filter(filePath => filePath.endsWith(filename));

    if (possibleMatches.length === 1) {
        return path.relative(fileDir, possibleMatches[0]); // Return correct relative path
    }

    if (possibleMatches.length > 1) {
        // Find closest match based on path
        const closestMatch = possibleMatches
            .map(match => ({
                path: match,
                distance: path.relative(fileDir, match).split(path.sep).length
            }))
            .sort((a, b) => a.distance - b.distance)[0].path;

        let relativePath = path.relative(fileDir, closestMatch);

        // Avoid unnecessary use of ../
        if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) {
            relativePath = `./${relativePath}`;
        }

        return relativePath;
    }

    return null; // If no match was found return null
}
