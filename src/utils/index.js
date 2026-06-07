const PAGE_URLS = {
    StartProject: '/start',
    Software: '/software',
    Foresight: '/foresight',
};

export function createPageUrl(pageName) {
    if (PAGE_URLS[pageName]) return PAGE_URLS[pageName];
    return '/' + pageName.replace(/ /g, '-');
}
