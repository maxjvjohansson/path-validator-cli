# path-validator-cli
A CLI tool and future VS Code extension for detecting and fixing broken file paths in HTML, CSS, PHP, and JavaScript projects. Prevent deployment issues by validating and correcting paths directly in your codebase.

# Path Validator CLI Tool

A command-line tool for validating and fixing path naming conventions across your project files.

## Features

- ✅ Validates file and directory names against common naming conventions.
- Support for HTML, CSS, PHP, and JavaScript projects.
- 🔍 Detects issues like:
  - Spaces in filenames
  - Special characters
  - Inconsistent casing
  - Invalid path lengths
  - Platform-specific path incompatibilities
- 🛠️ Automatically fixes detected issues (when not using --check-only)
- 📋 Generates detailed reports of found issues
- ⚡ Fast and lightweight


## Installation

```bash
npm install -g path-validator
```

## Usage

There are two main ways to use the path validator:

### 1. Check and Fix Mode (Default)
```bash
path-validator
```
This will:
- Scan your current directory
- Report any path issues found
- Automatically fix the issues by renaming files/directories

### 2. Check-Only Mode
```bash
path-validator --check-only
```
This will:
- Scan your current directory
- Report any path issues found
- Not make any changes to your files

## Examples

```bash
# Check and fix paths in the current directory
path-validator

# Only check paths without making changes
path-validator --check-only

```

## Configuration

By default, Path Validator follows these rules:
- No spaces in filenames
- No special characters except `-` and `_`
- Maximum path length of 255 characters
- Case-sensitive naming

You can customize these rules by creating a `.pathvalidatorrc` file in your project root.

## Output

The tool provides detailed feedback about invalid paths found in your codebase:

```
Running path validation...
================================================================================
                           3 INVALID PATHS FOUND:
================================================================================
   Invalid Path:          '../src/core/fix.js'
   File Referenced In:    /Users/jskepp/Documents/GitHub/path-validator-cli/test/testFix.js
   Line Number:           2
   Suggestion:            "Check if the file was moved or renamed manually."
--------------------------------------------------------------------------------
   Invalid Path:          '../src/utils/parser.js'
   File Referenced In:    /Users/jskepp/Documents/GitHub/path-validator-cli/test/testParser.js
   Line Number:           4
   Suggestion:            "Check if the file was moved or renamed manually."
--------------------------------------------------------------------------------
   Invalid Path:          '../src/utils/regex.js'
   File Referenced In:    /Users/jskepp/Documents/GitHub/path-validator-cli/test/testParser.js
   Line Number:           5
   Suggestion:            "Check if the file was moved or renamed manually."
--------------------------------------------------------------------------------
  
 3 ISSUES FOUND.
================================================================================
 😔Yikes! Not the worst, but definitely not great. You *do* know how paths work, right?😔
================================================================================
```

Each issue shows:
- The invalid path that was found
- The file where this path is referenced
- The exact line number where the reference occurs
- A helpful suggestion for fixing the issue
- ..and a passive aggressive reality check based on how many issues there are. 

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Roadmap

- [ ] Implement recursive mode for nested directories
- [ ] Add ignore patterns support
- [ ] Support for other programming languages like C#

## Authors

- Max Johansson - [maxjvjohansson](https://github.com/maxjvjohansson)
- Jesper Skeppstedt - [Skjesper](https://github.com/Skjesper)

## Acknowledgments

- Thanks to all contributors who have helped shape this tool
- Inspired by similar tools in the ecosystem
