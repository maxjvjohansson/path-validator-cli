// Import required modules
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';

// Helper functions for file operations
const getStats = async (path) => fs.stat(path);
const readFileContent = async (path) => fs.readFile(path, 'utf-8');

/**
 * Search for files in a directory based on specified criteria
 * @param {string} directory - The root directory to start searching from
 * @param {Object} options - Search configuration options
 * @returns {Promise<Array>} Array of file information objects
 */
export async function searchPaths(directory, options = {}) {
  // Default search options
  const {
    pattern = '**/*',  // Default pattern matches all files and directories
    extensions = ['.js', '.html', '.css', '.php'],  // Default file extensions to search for
    exclude = ['**/node_modules/**', '**/dist/**']  // Directories to exclude from search
  } = options;

  // Create search pattern - if pattern includes a dot, use as is, otherwise append extensions
  const searchPattern = pattern.includes('.') ? pattern : `**/*{${extensions.join(',')}}`;
  
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

