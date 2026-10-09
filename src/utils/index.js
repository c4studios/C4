const PAGE_URLS = {
    StartProject: '/start',
    PrivacyPolicy: '/privacy-policy',
    TermsOfService: '/terms-of-service',
    HowWeUseAI: '/how-we-use-ai',
    SeoCopy: '/seo-and-copywriting',
    LogoDesign: '/logo-design',
};

export function createPageUrl(pageName) {
    if (PAGE_URLS[pageName]) return PAGE_URLS[pageName];
    return '/' + pageName.replace(/ /g, '-');
}
