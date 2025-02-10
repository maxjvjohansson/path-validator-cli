// src/core/validate.js
import fs from 'fs/promises';
import path from 'path';
import { searchPaths } from './search.js';

// Funktion för att validera sökvägar
export async function validatePaths(directory, options = {}) {
 const files = await searchPaths(directory);
 const validationResults = [];

 for (const file of files) {
   const content = await fs.readFile(file.path, 'utf-8');
   const fileType = path.extname(file.path);
   const paths = extractPaths(content, fileType);
   
   const invalidPaths = [];
   for (const foundPath of paths) {
     if (!isValidPath(foundPath, file.path)) {
       invalidPaths.push({
         path: foundPath,
         reason: getInvalidReason(foundPath)
       });
     }
   }

   if (invalidPaths.length > 0) {
     validationResults.push({
       file: file.path,
       invalid: invalidPaths
     });
   }
 }
 
 return validationResults;
}

function extractPaths(content, fileType) {
 // Implementeras senare med regex för olika filtyper
 return [];
}

function isValidPath(pathToCheck, sourcePath) {
 try {
   const fullPath = path.resolve(path.dirname(sourcePath), pathToCheck);
   return fs.access(fullPath).then(() => true).catch(() => false);
 } catch {
   return false;
 }
}

function getInvalidReason(path) {
 if (!path) return 'Tom sökväg';
 if (path.includes('..')) return 'Relativ sökväg utanför projektet';
 return 'Sökvägen existerar inte';
}

// Test
if (process.argv[1] === new URL(import.meta.url).pathname) {
 validatePaths('./')
   .then(results => console.log('Validering:', results))
   .catch(error => console.error('Fel:', error));
}