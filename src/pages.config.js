/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import CaseStudy from './pages/CaseStudy';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Home from './pages/Home';
import Lens from './pages/Lens';
import Portfolio from './pages/Portfolio';
import Rebuild from './pages/Rebuild';
import Services from './pages/Services';
import StartProject from './pages/StartProject';
import Terms from './pages/Terms';
import Ventures from './pages/Ventures';
import ServicesPricing from './pages/ServicesPricing';
import WebDesignPricing from './pages/WebDesignPricing';
import BrandingPricing from './pages/BrandingPricing';
import C4LensPricing from './pages/C4LensPricing';
import SEOPricing from './pages/SEOPricing';
import AutomationPricing from './pages/AutomationPricing';
import SocialMediaPricing from './pages/SocialMediaPricing';
import BundlesPricing from './pages/BundlesPricing';
import SupportPlans from './pages/SupportPlans';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "CaseStudy": CaseStudy,
    "Contact": Contact,
    "Support": Support,
    "Home": Home,
    "Lens": Lens,
    "Portfolio": Portfolio,
    "Rebuild": Rebuild,
    "Services": Services,
    "StartProject": StartProject,
    "Terms": Terms,
    "Ventures": Ventures,
    "ServicesPricing": ServicesPricing,
    "WebDesignPricing": WebDesignPricing,
    "BrandingPricing": BrandingPricing,
    "C4LensPricing": C4LensPricing,
    "SEOPricing": SEOPricing,
    "AutomationPricing": AutomationPricing,
    "SocialMediaPricing": SocialMediaPricing,
    "BundlesPricing": BundlesPricing,
    "SupportPlans": SupportPlans,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};