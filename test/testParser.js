/*import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import { parseHTML, parseCSS, parseJS, parsePHP, determinePathType } from '../src/utils/parser.js';
import { cssRegex, jsRegex } from '../src/utils/regex.js';

describe('Parser Functions', () => {
    let existsSyncStub;
    const projectRoot = '/Users/Webbutveckling/Desktop/WebDev/Assignments/path-validator-cli';

    beforeEach(() => {
        // Mock fs.existsSync to simulate file existence
        existsSyncStub = sinon.stub(fs, 'existsSync').callsFake((filePath) => {
            console.log(`Mock fs.existsSync called for: ${filePath}`);
            return true; // Simulate that all files exist
        });
    });

    afterEach(() => {
        existsSyncStub.restore();
    });

    it('should extract valid and invalid paths from HTML', () => {
        const htmlContent = `<link rel="stylesheet" href="styles/main.css">`;
        const result = parseHTML(htmlContent, 'index.html', projectRoot);
        console.log(result);
        expect(result.validMatches).to.have.lengthOf(1);
    });

    it('should extract valid and invalid paths from CSS', () => {
        const cssContent = `body { background: url('images/bg.jpg'); }`;
        const result = parseCSS(cssContent, 'styles/main.css', projectRoot);
        console.log(result);
        expect(result.validMatches).to.have.lengthOf(1);
    });

    it('should extract valid and invalid paths from JavaScript', () => {
        const jsContent = `import module from './scripts/module.js';`;
        const result = parseJS(jsContent, 'scripts/app.js', projectRoot);
        console.log(result);
        expect(result.validMatches).to.have.lengthOf(1);
    });

    it('should extract valid and invalid paths from PHP', () => {
        const phpContent = `<?php include 'includes/header.php'; ?>`;
        const result = parsePHP(phpContent, 'index.php', projectRoot);
        console.log(result);
        expect(result.validMatches).to.have.lengthOf(1);
    });

    it('should classify absolute, relative, and URL paths correctly', () => {
        expect(determinePathType('http://example.com')).to.equal('URL');
        expect(determinePathType('//cdn.example.com/script.js')).to.equal('URL');
        expect(determinePathType('/absolute/path/file.js')).to.equal('absolute');
        expect(determinePathType('relative/path/file.js')).to.equal('relative');
    });
});
*/
