import fs from 'fs';
import path from 'path';
import { htmlRegex, cssRegex, jsRegex, phpRegex } from './regex.js';

//---------------------------------------
// Parses HTML content and extracts paths.
//---------------------------------------
export function parseHTML(content, filePath, projectRoot) {
    return parseWithRegex(content, filePath, htmlRegex, 'HTML', projectRoot);
}

//---------------------------------------
// Parses CSS content and extracts paths.
//---------------------------------------
export function parseCSS(content, filePath, projectRoot) {
    return parseWithRegex(content, filePath, cssRegex, 'CSS', projectRoot);
}

//---------------------------------------
// Parses JavaScript content and extracts paths.
//---------------------------------------
// Array containing built in modules that are supposed to not get flagged falsely as invalid paths by the program
const nodeBuiltInModules = new Set([
    'fs', 'fs/promises', 'path', 'os', 'util', 'crypto', 'http', 'https', 'stream', 'events',
    'child_process', 'cluster', 'dns', 'net', 'tls', 'zlib', 'buffer', 'vm', 'url',
    'querystring', 'assert', 'readline', 'string_decoder', 'timers', 'tty', 'dgram'
]);

export function parseJS(content, filePath, projectRoot) {
    const { validMatches, invalidMatches } = parseWithRegex(content, filePath, jsRegex, 'JavaScript', projectRoot);

    return {
        validMatches,
        invalidMatches: invalidMatches.filter(match => {
            const extractedPath = match.path;

            if (nodeBuiltInModules.has(extractedPath)) {
                return false;
            }

            if (!extractedPath.startsWith('.') && !extractedPath.startsWith('/') && !extractedPath.includes('/')) {
                return false;
            }

            return true;
        })
    };
}

//---------------------------------------
// Parses PHP content and extracts paths.
//---------------------------------------
export function parsePHP(content, filePath, projectRoot) {
    return parseWithRegex(content, filePath, phpRegex, 'PHP', projectRoot);
}

// Function to parse content with given regex patterns
function parseWithRegex(content, filePath, regexCollection, fileType, projectRoot) {
    const validMatches = [];
    const invalidMatches = [];

    Object.entries(regexCollection).forEach(([key, regex]) => {
        [...content.matchAll(regex)].forEach(match => {
            const extractedPath = match[1] || '';
            if (!extractedPath) return;

            const pathType = determinePathType(extractedPath);

            const matchData = {
                path: extractedPath,  // Extracted path
                file: filePath,  // Source file
                type: pathType, // Absolute, relative, or URL
                matchType: key,  // Ex: "src", "href", "require"
                fileType: fileType // HTML, CSS, JS, PHP
            };

            // Separate valid/invalid matches and insert in respective array
            if (isPotentiallyInvalid(extractedPath, pathType, filePath, projectRoot)) {
                invalidMatches.push(matchData);
            } else {
                validMatches.push(matchData);
            }
        });
    });

    return { validMatches, invalidMatches };
}

// Function to check if a path is absolute/relative, also check for URL
export function determinePathType(filePath) {
    if (filePath.startsWith('http') || filePath.startsWith('//')) {
        return 'URL';
    } else if (filePath.startsWith('/')) {
        return 'absolute';
    } else {
        return 'relative';
    }
}

// Function to check if a path is potentially invalid based on certain criteria
export function isPotentiallyInvalid(filePath, type, baseFile , projectRoot) {
    if (!baseFile) return true; // If baseFile is missing, we can't validate
    if (!projectRoot) return true; // If projectRoot is missing, we can't validate
    if (type === 'URL') {
        return !isValidURL(filePath); // Check if URL is valid
    }

    if (type === 'relative') {
        const absolutePath = path.resolve(path.dirname(baseFile), filePath);
        
        if (!fs.existsSync(absolutePath)) return true; // Check if file exists
        if (!absolutePath.startsWith(projectRoot)) return true; // Prevent path from extending project root
        if (filePath.includes('//')) return true; // Unnecessary use of "//"
        if (filePath.includes('././')) return true; // Unnecessary use of "./"
    }

    if (type === 'absolute') {
        if (!fs.existsSync(filePath)) return true; // Absolute path must point to an actual file
    }

    return false; // Else, path is valid
}

// Function to validate if a given URL is correctly formatted
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
