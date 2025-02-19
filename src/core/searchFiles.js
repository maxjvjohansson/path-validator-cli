import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';

// Helper functions for file operations
const getStats = async (path) => fs.stat(path);

export async function searchPaths(directory, options = {}) {
  const {
    pattern = '**/*',  // Default pattern matches all files and directories
    extensions = ['.js', '.html', '.css', '.php', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ttf', '.woff', '.woff2'],
    exclude = [
      '**/node_modules/**', 
      '**/dist/**', 
      '**/vendor/**', 
      '**/build/**', 
      '**/out/**', 
      '**/target/**', 
      '**/.git/**', 
      '**/.svn/**', 
      '**/.hg/**', 
      '**/tmp/**', 
      '**/temp/**', 
      '**/.cache/**', 
      '**/.vscode/**', 
      '**/.idea/**'
    ]  // Directories to exclude from search
  } = options;

  // Allow searching for all files (including images, fonts)
  const searchPattern = `**/*`;

  // Use fast-glob to find all matching files
  const files = await fg(searchPattern, {
    cwd: directory,      // Set root directory for search
    absolute: true,      // Return absolute file paths
    ignore: exclude,     // Exclude specified directories
    onlyFiles: true      // Only return files, not directories
  });

  // Get detailed information for each found file
  const results = await Promise.all(
    files.map(async (filePath) => {
      const stats = await getStats(filePath);
      return {
        path: filePath,                              // Full path to file
        relativePath: path.relative(directory, filePath),  // Path relative to search directory
        size: stats.size,                            // File size in bytes
        extension: path.extname(filePath)            // File extension
      };
    })
  );

  return results;
}
