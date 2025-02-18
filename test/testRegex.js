/*import { expect } from 'chai';
import { phpRegex } from '../src/utils/regex.js';

describe('PHP Regex Tests', () => {
    const testCases = [
        {
            name: 'include',
            regex: phpRegex.include,
            input: "include 'file.php';",
            expectedMatch: 'file.php'
        },
        {
            name: 'include_once',
            regex: phpRegex.includeOnce,
            input: "include_once 'config.php';",
            expectedMatch: 'config.php'
        },
        {
            name: 'require',
            regex: phpRegex.require,
            input: "require 'settings.php';",
            expectedMatch: 'settings.php'
        },
        {
            name: 'require_once',
            regex: phpRegex.requireOnce,
            input: "require_once 'autoload.php';",
            expectedMatch: 'autoload.php'
        },
        {
            name: 'file_get_contents',
            regex: phpRegex.fileGetContents,
            input: "file_get_contents('https://example.com/data.json');",
            expectedMatch: 'https://example.com/data.json'
        },
        {
            name: 'header(Location)',
            regex: phpRegex.headerLocation,
            input: "header('Location: https://example.com');",
            expectedMatch: 'https://example.com'
        },
        {
            name: 'readfile',
            regex: phpRegex.readfile,
            input: "readfile('document.txt');",
            expectedMatch: 'document.txt'
        },
        {
            name: 'fopen',
            regex: phpRegex.fopen,
            input: "fopen('log.txt', 'r');",
            expectedMatch: 'log.txt'
        },
        {
            name: 'opendir',
            regex: phpRegex.opendir,
            input: "opendir('/var/www/html');",
            expectedMatch: '/var/www/html'
        },
        {
            name: 'move_uploaded_file',
            regex: phpRegex.moveUploadedFile,
            input: "move_uploaded_file('/tmp/upload.tmp', '/var/www/uploads/image.jpg');",
            expectedMatch: '/tmp/upload.tmp'
        }
    ];

    testCases.forEach(({ name, regex, input, expectedMatch }) => {
        it(`should match ${name}`, () => {
            const result = regex.exec(input);
            expect(result).to.not.be.null;
            if (result) {
                expect(result[1]).to.equal(expectedMatch);
            }
        });
    });
});
*/
