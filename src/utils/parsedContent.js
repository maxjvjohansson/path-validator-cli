import fs from 'fs';
import path from 'path';
import { htmlRegex, cssRegex, jsRegex, phpRegex } from './regexPatterns.js';

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
    const extractedPaths = parseWithRegex(content, filePath, cssRegex, 'CSS', projectRoot);

    // Filter out duplicates from the same file (ex: to not falsely flag background url twice or more)
    const uniquePaths = [];
    const seenPaths = new Set();

    for (const pathData of extractedPaths.invalidMatches) {
        const key = `${filePath}:${pathData.path}`;
        if (!seenPaths.has(key)) {
            seenPaths.add(key);
            uniquePaths.push(pathData);
        }
    }

    return { validMatches: extractedPaths.validMatches, invalidMatches: uniquePaths };
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
    const { validMatches, invalidMatches } = parseWithRegex(content, filePath, phpRegex, 'PHP', projectRoot);

    // Parse normal HTML inside PHP files
    const { validMatches: htmlValid, invalidMatches: htmlInvalid } = parseWithRegex(content, filePath, htmlRegex, 'HTML', projectRoot);

    // Extract PHP-echoed raw paths
    const echoedPathMatches = [...content.matchAll(phpRegex.echoedPath)];
    let echoedPaths = [];

    echoedPathMatches.forEach(match => {
        echoedPaths.push({
            path: match[1],
            file: filePath,
            type: determinePathType(match[1]), // Absolute, relative, URL
            matchType: 'echoedPath',
            fileType: 'PHP'
        });
    });

    // Filter echoed paths: Only flag if they are absolute and incorrect
    const echoedPathInvalid = echoedPaths.filter(pathData => {
        return isPotentiallyInvalid(pathData.path, pathData.type, filePath, projectRoot);
    });

    // Parse inline CSS inside `<style>` blocks within PHP
    const inlineCSS = extractInlineCode(content, 'style');
    let cssValid = [], cssInvalid = [];
    if (inlineCSS.trim()) {
        ({ validMatches: cssValid, invalidMatches: cssInvalid } = parseWithRegex(inlineCSS, filePath, cssRegex, 'CSS', projectRoot));
    }

    // Parse inline JavaScript inside `<script>` blocks within PHP
    const inlineJS = extractInlineCode(content, 'script');
    let jsValid = [], jsInvalid = [];
    if (inlineJS.trim()) {
        ({ validMatches: jsValid, invalidMatches: jsInvalid } = parseWithRegex(inlineJS, filePath, jsRegex, 'JavaScript', projectRoot));
    }

    // INLINE DEDUPLICATION TO REMOVE DUPLICATES
    const allInvalid = [...invalidMatches, ...htmlInvalid, ...echoedPathInvalid, ...cssInvalid, ...jsInvalid];
    const seenPaths = new Set();
    const uniqueInvalidPaths = [];

    allInvalid.forEach(pathData => {
        const key = `${pathData.file}:${pathData.path}`;
        if (!seenPaths.has(key)) {
            seenPaths.add(key);
            uniqueInvalidPaths.push(pathData);
        }
    });

    return {
        validMatches: [...validMatches, ...htmlValid, ...cssValid, ...jsValid],
        invalidMatches: uniqueInvalidPaths
    };
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
export function isPotentiallyInvalid(filePath, type, baseFile, projectRoot) {
    if (!baseFile || !projectRoot) return true; // Cannot validate if baseFile or projectRoot is missing
    
    if (type === 'URL') {
        return !isValidURL(filePath); // Check if URL is valid
    }

    const absolutePath = path.resolve(path.dirname(baseFile), filePath);
    
    if (type === 'relative') {
        // If the resolved path exists, it is NOT invalid
        if (fs.existsSync(absolutePath)) return false;

        // Prevent paths that escape the project root
        if (!absolutePath.startsWith(projectRoot)) return true;

        // Prevent unnecessary "//" or "././"
        if (filePath.includes('//') || filePath.includes('././')) return true;

        // Allow correctly formed relative paths
        if (!filePath.startsWith('../')) return false;
    }

    if (type === 'absolute') {
        // Absolute paths must exist
        if (!fs.existsSync(filePath)) return true;
    }

    return false; // Otherwise, the path is valid
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

function extractInlineCode(content, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
    let extractedCode = '';

    let match;
    while ((match = regex.exec(content)) !== null) {
        extractedCode += match[1] + '\n';
    }

    return extractedCode;
}
