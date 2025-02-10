// ----------------------------------------
// HTML Regex
// ----------------------------------------
export const htmlRegex = {
    // Matches the 'src' attribute for various media elements (img, script, iframe, etc.)
    src: /<(?:img|script|iframe|audio|video|source)\s+[^>]*?src=["'](.*?)["']/gi,

    // Matches the 'href' attribute for anchor, link, and area tags
    href: /<(?:a|link|area)\s+[^>]*?href=["'](.*?)["']/gi,

    // Matches the 'action' attribute for form elements
    formAction: /<form\s+[^>]*?action=["'](.*?)["']/gi,

    // Matches 'data-*' attributes in any HTML element
    dataAttr: /<\w+\s+[^>]*?data-[a-zA-Z0-9_-]+=["'](.*?)["']/gi,

    // Matches the 'poster' attribute in video elements
    poster: /<video\s+[^>]*?poster=["'](.*?)["']/gi,

    // Matches the 'manifest' attribute in the <html> tag
    manifest: /<html\s+[^>]*?manifest=["'](.*?)["']/gi
};

// ----------------------------------------
// CSS Regex
// ----------------------------------------
export const cssRegex = {
    // Matches the 'url()' in various CSS properties
    url: /@import\s+url\(['"]?(.*?)['"]?\)|(?:background-image|cursor|border-image|mask-image|filter|clip-path|content)\s*:\s*url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in background-image property
    backgroundImage: /background-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in @import CSS rule
    import: /@import\s+url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in cursor property
    cursor: /cursor\s*:\s*url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in content property
    content: /content\s*:\s*url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in border-image property
    borderImage: /border-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in mask-image property
    maskImage: /mask-image\s*:\s*url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in filter property (for background images, etc.)
    filter: /filter\s*:\s*url\(['"]?(.*?)['"]?\)/gi,

    // Match the URL in clip-path property
    clipPath: /clip-path\s*:\s*url\(['"]?(.*?)['"]?\)/gi
};

  