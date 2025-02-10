// ----------------------------------------
// HTML Regex
// ----------------------------------------
export const htmlRegex = {
    src: /<(?:img|script|iframe|audio|video|source)\s+[^>]*?src=["'](.*?)["']/gi,
    href: /<(?:a|link|area)\s+[^>]*?href=["'](.*?)["']/gi,
    formAction: /<form\s+[^>]*?action=["'](.*?)["']/gi,
    dataAttr: /<\w+\s+[^>]*?data-[a-zA-Z0-9_-]+=["'](.*?)["']/gi,
    poster: /<video\s+[^>]*?poster=["'](.*?)["']/gi,
    manifest: /<html\s+[^>]*?manifest=["'](.*?)["']/gi
};

// ----------------------------------------
// CSS Regex
// ----------------------------------------
export const cssRegex = {
    url: /@import\s+url\(['"]?(.*?)['"]?\)|(?:background-image|cursor|border-image|mask-image|filter|clip-path|content)\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    backgroundImage: /background-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    import: /@import\s+url\(['"]?(.*?)['"]?\)/gi,
    cursor: /cursor\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    content: /content\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    borderImage: /border-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    maskImage: /mask-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    filter: /filter\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    clipPath: /clip-path\s*:\s*url\(['"]?(.*?)['"]?\)/gi
};

// ----------------------------------------
// JavaScript Regex
// ----------------------------------------
export const jsRegex = {
    es6Import: /import\s+['"]([^'"]+)['"]/gi,
    commonJSRequire: /require\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    fetch: /fetch\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    xhrOpen: /XMLHttpRequest\.open\s*\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]\s*\)/gi,
    windowLocation: /window\.location\s*=\s*['"]([^'"]+)['"]/gi,
    documentLocation: /document\.location\s*=\s*['"]([^'"]+)['"]/gi,
    newURL: /new\s+URL\s*\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/gi,
    scriptSrc: /script\.src\s*=\s*['"]([^'"]+)['"]/gi,
    linkHref: /link\.href\s*=\s*['"]([^'"]+)['"]/gi,
    imgSrc: /img\.src\s*=\s*['"]([^'"]+)['"]/gi,
    backgroundImage: /style\.backgroundImage\s*=\s*['"]?url\(['"]?([^'"]+)['"]?\)/gi,
    serviceWorker: /navigator\.serviceWorker\.register\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    worker: /new\s+Worker\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    audio: /new\s+Audio\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    videoSrc: /video\.src\s*=\s*['"]([^'"]+)['"]/gi
};
