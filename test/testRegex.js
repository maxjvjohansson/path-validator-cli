// regex.test.js
import { expect } from 'chai';
import { jsRegex } from '../src/utils/regex.js';

describe('JavaScript Regex Tests', () => {
    const testCases = [
        {
            name: 'ES6 import',
            regex: jsRegex.es6Import,
            input: "import 'some-module';",
            expectedMatch: 'some-module'
        },
        {
            name: 'CommonJS require',
            regex: jsRegex.commonJSRequire,
            input: "require('another-module');",
            expectedMatch: 'another-module'
        },
        {
            name: 'fetch call',
            regex: jsRegex.fetch,
            input: "fetch('https://example.com');",
            expectedMatch: 'https://example.com'
        },
        {
            name: 'XMLHttpRequest.open',
            regex: jsRegex.xhrOpen,
            input: "XMLHttpRequest.open('GET', 'https://example.com');",
            expectedMatch: 'https://example.com'
        },
        {
            name: 'window.location',
            regex: jsRegex.windowLocation,
            input: "window.location = 'https://example.com';",
            expectedMatch: 'https://example.com'
        },
        {
            name: 'document.location',
            regex: jsRegex.documentLocation,
            input: "document.location = 'https://example.com';",
            expectedMatch: 'https://example.com'
        },
        {
            name: 'new URL with import.meta.url',
            regex: jsRegex.newURL,
            input: "new URL('path', import.meta.url);",
            expectedMatch: 'path'
        },
        {
            name: 'script.src',
            regex: jsRegex.scriptSrc,
            input: "script.src = 'https://example.com/script.js';",
            expectedMatch: 'https://example.com/script.js'
        },
        {
            name: 'link.href',
            regex: jsRegex.linkHref,
            input: "link.href = 'https://example.com/style.css';",
            expectedMatch: 'https://example.com/style.css'
        },
        {
            name: 'img.src',
            regex: jsRegex.imgSrc,
            input: "img.src = 'https://example.com/image.jpg';",
            expectedMatch: 'https://example.com/image.jpg'
        },
        {
            name: 'style.backgroundImage',
            regex: jsRegex.backgroundImage,
            input: "style.backgroundImage = 'url(https://example.com/image.jpg)';",
            expectedMatch: 'https://example.com/image.jpg'
        },
        {
            name: 'service worker registration',
            regex: jsRegex.serviceWorker,
            input: "navigator.serviceWorker.register('https://example.com/service-worker.js');",
            expectedMatch: 'https://example.com/service-worker.js'
        },
        {
            name: 'new Worker',
            regex: jsRegex.worker,
            input: "new Worker('worker.js');",
            expectedMatch: 'worker.js'
        },
        {
            name: 'new Audio',
            regex: jsRegex.audio,
            input: "new Audio('audio.mp3');",
            expectedMatch: 'audio.mp3'
        },
        {
            name: 'video.src',
            regex: jsRegex.videoSrc,
            input: "video.src = 'https://example.com/video.mp4';",
            expectedMatch: 'https://example.com/video.mp4'
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