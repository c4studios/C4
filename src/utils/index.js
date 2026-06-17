const PAGE_URLS = {
    StartProject: '/start',
    Software: '/software',
    ForesightBusiness: '/ai-training-for-business',
    ForesightSchools: '/ai-training-for-schools',
    ForesightLaw: '/ai-training-for-law-firms',
    TrainingEnquiry: '/ai-training-enquiry',
};

export function createPageUrl(pageName) {
    if (PAGE_URLS[pageName]) return PAGE_URLS[pageName];
    return '/' + pageName.replace(/ /g, '-');
}
