const PAGE_URLS = {
    StartProject: '/start',
    PrivateAI: '/private-ai',
    C4i: '/c4i',
    PrivacyPolicy: '/privacy-policy',
    TermsOfService: '/terms-of-service',
    HowWeUseAI: '/how-we-use-ai',
    SeoCopy: '/seo-and-copywriting',
};

export function createPageUrl(pageName) {
    if (PAGE_URLS[pageName]) return PAGE_URLS[pageName];
    return '/' + pageName.replace(/ /g, '-');
}
