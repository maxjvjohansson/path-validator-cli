export const errorMessages = {
    absolutePath: {
        message: "Path is absolute",
        suggestion: "Try a relative path",
    },
    missingFile: {
        message: "File does not exist",
        suggestion: "Check if the file was moved or renamed",
    },
    tooManyBack: {
        message: "Path goes too far back in directory",
        suggestion: "Adjust the path to stay within project root",
    },
    incorrectRelative: {
        message: "Incorrect relative path",
        suggestion: "Try './' instead of '../' if the file is in the same folder",
    }
};
