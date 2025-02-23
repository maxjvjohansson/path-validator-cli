

# Path Validator CLI Tool

A command-line tool that ensures your project paths work not just locally, but also in production deployments.

## What Does It Do?

This tool helps developers avoid common path-related issues that can break projects when moving from a local environment to production. It scans your project for path inconsistencies and suggests (or automatically applies) fixes to ensure smooth deployment.

## Features

- Scans and validates paths across HTML, CSS, PHP, and JavaScript projects
- Automatically adjusts paths that work locally but would break in deployment
- Detects and fixes issues like:
  - Incorrect relative paths (../, ./, /)
  - Paths that work locally but break when deployed
  - Absolute paths that need to be relative
  - Missing files or incorrect references
- Automatically applies fixes (when not using --check-only)
- Generates a clear report of all detected issues and suggested corrections
- Fast, lightweight & easy to use



## Installation

```bash
npm install -g path-validator-cli
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

## Dependencies

- **chalk**: Colors and styles text output in the terminal 
- **commander**: Creates and manages command-line interfaces (CLI) and parses arguments 
- **fast-glob**: Quickly finds files and directories using pattern matching 
- **figlet**: Converts text into ASCII art banners 
- **inquirer**: Creates interactive command-line prompts and forms
- **ora**: Displays elegant loading spinners in the terminal



## Output

The tool provides detailed feedback about invalid paths found in your codebase:

<img src="https://github.com/user-attachments/assets/c705afd8-53fb-4914-af9e-53a0e442637e" width="500" alt="Path Validator Output Example 1"><br>
<img src="https://github.com/user-attachments/assets/5dbe459c-3900-4ade-8989-4285b9f3bf12" width="500" alt="Path Validator Output Example 2">


Each issue shows:
- The invalid path that was found
- In the file where the path is referenced, you can Ctrl-click (PC) or Command-click (Mac) to open the referenced file.
- The exact line number where the reference occurs
- A helpful suggestion for fixing the issue
- ..and a passive aggressive reality check based on how many issues there are. 

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Roadmap

- [ ] Add support for validating/correcting edge cases
- [ ] Support for other programming languages and frameworks like C#, React and more
- [ ] A path-validator --undo command

## Authors

- Max Johansson - [maxjvjohansson](https://github.com/maxjvjohansson)
- Jesper Skeppstedt - [Skjesper](https://github.com/Skjesper)
