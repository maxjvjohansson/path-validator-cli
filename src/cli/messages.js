export const errorMessages = {
    absolutePath: {
        message: "Path is absolute",
        suggestion: (correctPath) => `Try a relative path instead: "${correctPath}"`,
    },
    missingFile: {
        message: "File does not exist",
        suggestion: (correctPath = null) => 
            correctPath 
                ? `File not found in expected location. Did you mean: "${correctPath}"?`
                : "Check if the file was moved or renamed manually.",
    },
    tooManyBack: {
        message: "Path goes too far back in the directory",
        suggestion: "Adjust the path to stay within the project root.",
    },
    incorrectRelative: {
        message: "Incorrect relative path",
        suggestion: "Try './' instead of '../' if the file is in the same folder.",
    },
    unknownPath: {
        message: "Unknown error",
        suggestion: "This path could not be classified. Please check manually.",
    }
};

export const messages = {
    // Validation messages
    validationStart: "🔍 Running path validation...\n",
    validationComplete: (count) =>
        count > 0
            ? `\n📌 ${count} issues found. Run 'path-validator' without '--check-only' to fix them.`
            : "\n✅ No issues found. Your paths are clean!\n",
    errorOccurred: "❌ An error occurred during validation.",
    
    // Fixing messages
    fixingPathsStart: "🔧 Fixing invalid paths...",
    fixingPath: (oldPath, newPath) => `🔧 Fixing ${oldPath} → ${newPath}`,
    cannotFix: (path) => `❌ Cannot fix: ${path} (Manual fix required)`,
    fixComplete: "✅ Path correction complete!",
    noInvalidPaths: "✅ No invalid paths found!",
    foundInvalidPaths: (count) => `🔎 Found ${count} invalid paths. Attempting to fix...\n`,
    
    // Label messages
    fileReference: "File referenced in",
    lineReference: "Line",
    suggestionLabel: "Suggestion"
};
