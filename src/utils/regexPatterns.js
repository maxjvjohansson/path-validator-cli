// ----------------------------------------
// HTML Regex - Matches attributes containing URLs in HTML elements
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
// CSS Regex - CSS Regex - Matches URLs in CSS properties such as background-image, @import, cursor, etc.
// ----------------------------------------
export const cssRegex = {
    url: /@import\s+url\(['"]?(.*?)['"]?\)|(?:background-image|cursor|border-image|mask-image|filter|clip-path|content)\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    backgroundImage: /background-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    background: /url\(["']?([^"')]+)["']?\)/gi,
    import: /@import\s+["']([^"']+)["']/gi,
    cursor: /cursor\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    content: /content\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    borderImage: /border-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    maskImage: /mask-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    filter: /filter\s*:\s*url\(['"]?(.*?)['"]?\)/gi,
    clipPath: /clip-path\s*:\s*url\(['"]?(.*?)['"]?\)/gi
};

// ----------------------------------------
// JavaScript Regex - JavaScript Regex - Matches various JavaScript methods and properties that reference external resources
// ----------------------------------------
export const jsRegex = {
    import: /import\s+[^'"]*['"](?![a-zA-Z0-9_-]+$)([^'"]+)['"]/gi,
    require: /require\s*\(\s*["'](?![a-zA-Z0-9_-]+$)([^"']+)["']\s*\)/gi,
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

// ----------------------------------------
// PHP Regex - PHP Regex - Matches PHP functions that include or reference external files and URLs
// ----------------------------------------
export const phpRegex = {
    include: /include\s*['"]([^'"]+)['"];/gi,
    includeOnce: /include_once\s*['"]([^'"]+)['"];/gi,
    require: /require\s*['"]([^'"]+)['"];/gi,
    requireOnce: /require_once\s*['"]([^'"]+)['"];/gi,
    fileGetContents: /file_get_contents\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    headerLocation: /header\s*\(\s*['"]Location:\s*([^'"]+)['"]\s*\)/gi,
    readfile: /readfile\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    fopen: /fopen\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]+['"]\s*\)/gi,
    opendir: /opendir\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
    moveUploadedFile: /move_uploaded_file\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]+['"]\s*\)/gi

};

