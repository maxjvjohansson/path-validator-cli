// lib/pathValidator.js
import path from 'path';
import fs from 'fs/promises';
import { htmlRegex, cssRegex, jsRegex, phpRegex } from '../utils/regex.js';

export class PathValidator {
    constructor(options = {}) {
        this.options = {
            maxPathLength: options.maxPathLength || 255,
            caseSensitive: options.caseSensitive ?? true,
            allowedExtensions: options.allowedExtensions || ['.js', '.html', '.css', '.php']
        };
    }

    async validateFiles(files) {
        const validatedResults = await Promise.all(
            files.map(file => this.validateSingle(file))
        );

        return {
            results: validatedResults,
            summary: this.summarizeResults(validatedResults)
        };
    }

    async validateSingle(file) {
        const issues = [];
        const fixes = [];

        // Standard path validations
        this.validatePathLength(file.path, issues);
        this.validateCharacters(file.path, issues, fixes);
        this.validateExtension(file.extension, issues);
        await this.validateCaseSensitivity(file.path, issues);

        // Content validation based on file type
        try {
            const content = await fs.readFile(file.path, 'utf-8');
            const contentIssues = await this.validateFileContent(file.path, file.extension, content);
            issues.push(...contentIssues);
        } catch (error) {
            issues.push({
                type: 'CONTENT_READ_ERROR',
                message: `Unable to read file content: ${error.message}`,
                severity: 'error'
            });
        }

        return {
            ...file,
            validation: {
                isValid: issues.length === 0,
                issues,
                fixes
            }
        };
    }

    async validateFileContent(filePath, extension, content) {
        const issues = [];
        const basePath = path.dirname(filePath);

        switch (extension) {
            case '.html':
                await this.validateHtmlContent(content, basePath, issues);
                break;
            case '.css':
                await this.validateCssContent(content, basePath, issues);
                break;
            case '.js':
                await this.validateJsContent(content, basePath, issues);
                break;
            case '.php':
                await this.validatePhpContent(content, basePath, issues);
                break;
        }

        return issues;
    }

    async validateHtmlContent(content, basePath, issues) {
        // Check each HTML regex pattern
        for (const [attrType, regex] of Object.entries(htmlRegex)) {
            for (const match of content.matchAll(regex)) {
                const resourcePath = match[1];
                if (resourcePath) {
                    await this.validateResourcePath(resourcePath, basePath, attrType, issues);
                }
            }
        }
    }

    async validateCssContent(content, basePath, issues) {
        // Check each CSS regex pattern
        for (const [propertyType, regex] of Object.entries(cssRegex)) {
            for (const match of content.matchAll(regex)) {
                const resourcePath = match[1] || match[2]; // Some patterns have two capture groups
                if (resourcePath) {
                    await this.validateResourcePath(resourcePath, basePath, propertyType, issues);
                }
            }
        }
    }

    async validateJsContent(content, basePath, issues) {
        // Check each JavaScript regex pattern
        for (const [importType, regex] of Object.entries(jsRegex)) {
            for (const match of content.matchAll(regex)) {
                const resourcePath = match[1];
                if (resourcePath) {
                    await this.validateResourcePath(resourcePath, basePath, importType, issues);
                }
            }
        }
    }

    async validatePhpContent(content, basePath, issues) {
        // Check each PHP regex pattern
        for (const [includeType, regex] of Object.entries(phpRegex)) {
            for (const match of content.matchAll(regex)) {
                const resourcePath = match[1];
                if (resourcePath) {
                    await this.validateResourcePath(resourcePath, basePath, includeType, issues);
                }
            }
        }
    }

    async validateResourcePath(resourcePath, basePath, resourceType, issues) {
        // Skip URLs and data URIs
        if (resourcePath.startsWith('http') || resourcePath.startsWith('data:')) {
            return;
        }

        // Handle relative paths
        const absolutePath = path.resolve(basePath, resourcePath);
        
        try {
            await fs.access(absolutePath);
        } catch (error) {
            issues.push({
                type: 'BROKEN_REFERENCE',
                message: `Broken ${resourceType} reference: ${resourcePath}`,
                severity: 'error',
                resourceType,
                resourcePath,
                suggestion: `Check if the file exists at ${absolutePath}`
            });
        }
    }

    // Existing validation methods remain the same
    validatePathLength(filePath, issues) {
        if (filePath.length > this.options.maxPathLength) {
            issues.push({
                type: 'PATH_TOO_LONG',
                message: `Path exceeds ${this.options.maxPathLength} characters`,
                severity: 'error'
            });
        }
    }

    validateCharacters(filePath, issues, fixes) {
        const invalidChars = /[<>:"|?*]/g;
        if (invalidChars.test(filePath)) {
            issues.push({
                type: 'INVALID_CHARACTERS',
                message: 'Path contains invalid characters',
                severity: 'error'
            });
            fixes.push({
                type: 'REPLACE_INVALID_CHARS',
                description: 'Replace invalid characters with underscores',
                fixedPath: filePath.replace(invalidChars, '_')
            });
        }
    }

   

    validateExtension(extension, issues) {
        if (!this.options.allowedExtensions.includes(extension)) {
            issues.push({
                type: 'INVALID_EXTENSION',
                message: `Extension '${extension}' not in allowed list`,
                severity: 'warning'
            });
        }
    }

    async validateCaseSensitivity(filePath, issues) {
        if (!this.options.caseSensitive) return;

        try {
            const dir = path.dirname(filePath);
            const files = await fs.readdir(dir);
            const basename = path.basename(filePath);
            const conflicts = files.filter(f => 
                f.toLowerCase() === basename.toLowerCase() && f !== basename
            );

            if (conflicts.length > 0) {
                issues.push({
                    type: 'CASE_CONFLICT',
                    message: `Case conflict with: ${conflicts.join(', ')}`,
                    severity: 'warning'
                });
            }
        } catch (error) {
            issues.push({
                type: 'ACCESS_ERROR',
                message: `Cannot check case sensitivity: ${error.message}`,
                severity: 'warning'
            });
        }
    }

    summarizeResults(results) {
        return {
            totalFiles: results.length,
            validFiles: results.filter(r => r.validation.isValid).length,
            invalidFiles: results.filter(r => !r.validation.isValid).length,
            errors: results.reduce((acc, r) => 
                acc + r.validation.issues.filter(i => i.severity === 'error').length, 0
            ),
            warnings: results.reduce((acc, r) => 
                acc + r.validation.issues.filter(i => i.severity === 'warning').length, 0
            ),
            fixableIssues: results.reduce((acc, r) => 
                acc + r.validation.fixes.length, 0
            )
        };
    }
}