# path-validator-cli
A CLI tool and future VS Code extension for detecting and fixing broken file paths in HTML, CSS, PHP, and JavaScript projects. Prevent deployment issues by validating and correcting paths directly in your codebase.

# Path Validator CLI Tool

A command-line tool for validating and fixing path naming conventions across your project files.

## Features

- ✅ Validates file and directory names against common naming conventions
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

# Validate a specific directory
path-validator /path/to/directory

# Check a specific directory without fixes
path-validator /path/to/directory --check-only
```

## Configuration

By default, Path Validator follows these rules:
- No spaces in filenames
- No special characters except `-` and `_`
- Maximum path length of 255 characters
- Case-sensitive naming

You can customize these rules by creating a `.pathvalidatorrc` file in your project root.

## Output

The tool provides clear feedback about what it's doing:

```
Scanning: /your/project/directory
Found 3 issues:
  ✗ "My File.txt" contains spaces
  ✗ "специальный.doc" contains special characters
  ✗ "MYFILE.txt" case conflicts with "myfile.txt"

Fixed 3 issues:
  ✓ "My File.txt" → "my-file.txt"
  ✓ "специальный.doc" → "special.doc"
  ✓ "MYFILE.txt" → "myfile-2.txt"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Roadmap

- [ ] Add support for custom naming patterns
- [ ] Implement recursive mode for nested directories
- [ ] Add ignore patterns support
- [ ] Create configuration file generator

## Authors

- Your Name - *Initial work* - [YourGithub](https://github.com/yourusername)

## Acknowledgments

- Thanks to all contributors who have helped shape this tool
- Inspired by similar tools in the ecosystem
