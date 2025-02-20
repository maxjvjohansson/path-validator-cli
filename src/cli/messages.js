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
    validationStart: "\n🔍 Running path validation...\n",
    validationComplete: (count) => {
        let message = count > 0
            ? `\n📌 ${count} issues found. Run 'path-validator' without '--check-only' to fix them.`
            : "\n✅ No issues found. Your paths are clean!\n";

            if (count >= 7) {
                message += "\n🚨 Oof... this is bad. Your paths are a total mess. Maybe time to rethink your approach?\n";
            } else if (count >= 4) {
                message += "\n⚠️ Yikes! Not the worst, but definitely not great. You *do* know how paths work, right?\n";
            } else if (count > 0) {
                message += "\n🤨 Hm... a few minor mistakes. Almost like someone wasn't paying attention.\n";
            }
    
            return message;
        },
    fixingPaths: "\n🔧 Fixing invalid paths...\n",
    allFixed: "\n✅ All paths have been fixed!\n",
    noChanges: "\n📌 No changes were made. Exiting.\n",
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
