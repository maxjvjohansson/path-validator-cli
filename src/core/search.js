// Import required packages
import fg from 'fast-glob';         // For file pattern matching
import fs from 'fs/promises';       // Node.js file system promises
import path from 'path';            // For path manipulations

// Helper functions for file operations
const getStats = async (path) => fs.stat(path);        // Get file stats (size, dates etc)
const readFileContent = async (path) => fs.readFile(path, 'utf-8');  // Read file content

// Main search function
export async function searchPaths(directory, options = {}) {
 // Default options for file search
 const {
   pattern = '**/*',              // Match all files by default
   extensions = ['.js', '.html', '.css', '.php'],  // File types to search
   exclude = ['**/node_modules/**', '**/dist/**']  // Directories to ignore
 } = options;

 // Create search pattern based on extensions
 const searchPattern = pattern.includes('.') ? pattern : `**/*{${extensions.join(',')}}`;
 
 // Execute fast-glob search
 const files = await fg(searchPattern, {
   cwd: directory,                // Start directory
   absolute: true,                // Return full paths
   ignore: exclude,               // Ignore specified paths
   onlyFiles: true                // Only return files, not directories
 });

 // Process found files
 const results = await Promise.all(
   files.map(async (filePath) => {
     const stats = await getStats(filePath);
     return {
       path: filePath,            // Full path
       relativePath: path.relative(directory, filePath),  // Path relative to search dir
       size: stats.size,          // File size
       extension: path.extname(filePath)  // File extension
     };
   })
 );

 return results;
}

// Test code - runs when file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
   searchPaths('./')
     .then(files => console.log('Hittade filer:', files))
     .catch(error => console.error('Fel:', error));
}