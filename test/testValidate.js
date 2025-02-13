// test/testValidate.js
import { expect } from 'chai';
import { PathValidator } from '../src/core/validate.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('PathValidator', () => {
   let validator;
   const testDir = path.join(__dirname, 'test-files');

   // Create test directory and files before tests
   before(async () => {
       await fs.mkdir(testDir, { recursive: true });
       
       // Create images directory and test image
       const imagesDir = path.join(testDir, 'images');
       await fs.mkdir(imagesDir, { recursive: true });
       await fs.writeFile(path.join(imagesDir, 'logo.png'), 'dummy image content');
       
       // Create good file with valid image reference
       await fs.writeFile(
           path.join(testDir, 'correct-file.html'),
           '<img src="./images/logo.png">'
       );

       // Create bad file with invalid chars and missing image
       await fs.writeFile(
           path.join(testDir, 'bad<file>.html'),
           '<img src="./images/missing.png">'
       );
   });

   // Clean up test files after tests
   after(async () => {
       await fs.rm(testDir, { recursive: true, force: true });
   });

   beforeEach(() => {
       validator = new PathValidator({
           maxPathLength: 255,
           allowedExtensions: ['.js', '.html', '.css', '.php']
       });
   });

   it('should validate files and show results', async () => {
       const files = [
           {
               path: path.join(testDir, 'correct-file.html'),
               extension: '.html'
           },
           {
               path: path.join(testDir, 'bad<file>.html'),
               extension: '.html'
           }
       ];

       const results = await validator.validateFiles(files);
       
       console.log('\nValidation Results:');
       console.log('-------------------');
       console.log(`Total Files: ${results.summary.totalFiles}`);
       console.log(`Valid Files: ${results.summary.validFiles}`);
       console.log(`Invalid Files: ${results.summary.invalidFiles}`);
       
       results.results.forEach(file => {
           console.log(`\nFile: ${path.basename(file.path)}`);
           console.log(`Status: ${file.validation.isValid ? 'VALID ✅' : 'INVALID ❌'}`);
           if (!file.validation.isValid) {
               console.log('Issues:');
               file.validation.issues.forEach(issue => 
                   console.log(`- ${issue.message}`)
               );
           }
       });

       // Verify results
       expect(results.summary.totalFiles).to.equal(2);
       expect(results.summary.validFiles).to.equal(1);
       expect(results.summary.invalidFiles).to.equal(1);
   });
});