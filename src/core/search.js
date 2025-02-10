import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';

const getStats = async (path) => fs.stat(path);
const readFileContent = async (path) => fs.readFile(path, 'utf-8');

export async function searchPaths(directory, options = {}) {
 const {
   pattern = '**/*',
   extensions = ['.js', '.html', '.css', '.php'],
   exclude = ['**/node_modules/**', '**/dist/**']
 } = options;

 const searchPattern = pattern.includes('.') ? pattern : `**/*{${extensions.join(',')}}`;
 
 const files = await fg(searchPattern, {
   cwd: directory,
   absolute: true,
   ignore: exclude,
   onlyFiles: true
 });

 const results = await Promise.all(
   files.map(async (filePath) => {
     const stats = await getStats(filePath);
     return {
       path: filePath,
       relativePath: path.relative(directory, filePath),
       size: stats.size,
       extension: path.extname(filePath)
     };
   })
 );

 return results;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    searchPaths('./')
      .then(files => console.log('Hittade filer:', files))
      .catch(error => console.error('Fel:', error));
  }