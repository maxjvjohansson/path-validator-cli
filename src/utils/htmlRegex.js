export const htmlRegex = {
    src: /<(?:img|script|iframe|audio|video|source)\s+[^>]*?src=["'](.*?)["']/gi,
    href: /<(?:a|link|area)\s+[^>]*?href=["'](.*?)["']/gi,
    formAction: /<form\s+[^>]*?action=["'](.*?)["']/gi,
    dataAttr: /<\w+\s+[^>]*?data-[a-zA-Z0-9_-]+=["'](.*?)["']/gi,
    poster: /<video\s+[^>]*?poster=["'](.*?)["']/gi,
    manifest: /<html\s+[^>]*?manifest=["'](.*?)["']/gi 
};

  