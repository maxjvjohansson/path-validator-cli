export const errorMessages = {
    absolutePath: {
        message: "Path is absolute",
        suggestion: "Try a relative path instead.",
    },
    missingFile: {
        message: "File does not exist",
        suggestion: "Check if the file was moved or renamed manually.",
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
    validationComplete: (count) =>
        count > 0
            ? `\n📌 ${count} issues found. Run 'path-validator' without '--check-only' to fix them.`
            : "\n✅ No issues found. Your paths are clean!\n",
    fixingPaths: "\n🔧 Fixing invalid paths...\n",
    allFixed: "\n✅ All paths have been fixed!\n",
    noChanges: "\n📌 No changes were made. Exiting.\n",
    errorOccurred: "❌ An error occurred during validation.",
    fileReference: "File referenced in",
    lineReference: "Line",
    suggestionLabel: "Suggestion"
};
