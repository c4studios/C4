/*
 * Local search: a Google Business Profile, shown as an example card for the
 * example business, with the parts that make it complete keyed beside it.
 * Under it, the plan that keeps one current (Local, gbpPlan in pricing.js).
 *
 * The card is ours, drawn in the bench's type; it isn't a copy of Google's
 * screen and carries no rating, review count or figure. Its words are the
 * example's (examples.js) and it says it's an example. The two photos on it
 * are real photographs (photos.jsx). Which plans manage a profile, and every
 * price, is read from pricing.js; if a feature line or a price goes, the
 * sentence goes with it.
 *
 * The plan (added 25 Nov 2026, Caleb: "I want to add google business
 * profile management as an option in my seo section on my website"). Its
 * row is the price list's own row (PriceRow), on proof stock, because a
 * published price is evidence. It's the same row the price list shows.
 *
 * SOURCES for what the plan says it does, each read at Google's Business
 * Profile Help (support.google.com/business, en-AU) on 25 Nov 2026. The
 * pages carry no date. Quotes are as printed.
 *  1. "Manage your Business Profile owners and managers" (answer/3403100):
 *     "If you own a Business Profile, you can invite users to become owners
 *     or managers." "They can edit info, respond to reviews and manage
 *     posts." Managers "have mostly the same access to the profile as
 *     owners. The only exception is that they can't add or remove users or
 *     remove the profile." "To access and manage Business Profiles without
 *     the need to share your password, each user needs their own Google
 *     Account."
 *  2. "Business eligibility and ownership guidelines" (answer/13763036): an
 *     authorised representative, "For example: a third-party SEO/SEM
 *     company", must "Never claim a Business Profile without express consent
 *     from the business owner", must "Always keep the business owner informed
 *     about which actions the authorised representative will take", and
 *     must "whenever possible, encourage the business owner to create an
 *     account, own the Business Profile and add authorised representatives
 *     as managers."
 *  3. "Tips for working with third parties to manage your Business Profile"
 *     (answer/7163406): third parties "might offer services to keep your
 *     profile up to date, provide you with customer insights, answer your
 *     questions and respond to reviews." "Third parties can't promise nor
 *     directly influence your business's ranking on Google Search or Maps
 *     through any special means." "Only profile owners can control who has
 *     access and can update permissions at any time." "You have the right
 *     to know your profile's performance".
 *  4. "How to set special hours" (answer/6303076): special hours for
 *     "Holidays", "Special events" and "Other exceptional circumstances";
 *     "It's a good idea to confirm your hours for official holidays, even if
 *     they're the same as your regular hours."
 *  5. "Manage your Business Profile photos and videos" (answer/6103862):
 *     "Your photos and videos show up on Google only after you verify your
 *     Business Profile." "add photos or videos of your shop front, products
 *     and services". Quality: "the image should represent reality."
 *  6. "Create and manage posts on your Business Profile" (answer/7342169):
 *     posts "share announcements, offers, updates and event details directly
 *     with your customers on Search and Maps"; types "Update", "Offer",
 *     "Event"; Google reviews each post against its content policy.
 *  7. "Manage customer reviews" (answer/3474050): "Before you can reply to
 *     reviews, you must verify your business." "It will appear like your
 *     business replied, and your personal name won't be shown." "The person
 *     who wrote the review is notified when you reply."
 *  8. "Understand your Business Profile performance and insights"
 *     (answer/9918094): "Performance data is available only for verified
 *     Business Profiles." "Business Profile owners and managers can check
 *     the number of views, clicks and other customer interactions with your
 *     profile on Search and Maps." The metrics include Searches ("The search
 *     terms that people used to find your business"), Views, Directions,
 *     Calls ("The number of times a customer clicked on the call button")
 *     and Website clicks. "Performance data includes views, searches and
 *     actions from both organic search results and Google Ads."
 *  9. "Changes to Google Business Profile chat and call history"
 *     (answer/14919056): "As of 31 July 2024, the chat and call history
 *     features are no longer available in your Business Profile." Left out
 *     of the plan for that reason.
 *
 * DO NOT ADD:
 *  - That posts, photos or replies lift a profile's ranking, or by how much.
 *    Page 3 says no third party can promise placement, and the ranking page
 *    the GBP article quotes doesn't list posts.
 *  - Chat, call history or quote requests through the profile (page 9).
 *  - A count of posts or photos a month. Caleb hasn't set one.
 */
import { Globe, MapPin, Navigation, Phone, Clock, Share2 } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';
import { PHOTOS, Photo, Credit } from './photos';
import { EXAMPLES, YOU } from './examples';
import { has, money, GBP, GBP_SETUP } from './plans';
import { PriceRow } from './sections';

const EX = EXAMPLES[0];
const AREA = 'Joondalup and the northern suburbs';

const KEYS = [
  { k: 'a', t: 'The right category', d: 'The trade, named the way people search for it. It’s a big part of which searches the profile turns up in.' },
  { k: 'b', t: 'Where you work', d: 'A service area that matches the jobs you actually take.' },
  { k: 'c', t: 'Hours that are right', d: 'Including public holidays, so nobody drives over to a locked door.' },
  { k: 'd', t: 'Photos of real jobs', d: 'Your ute, your work, added as you go. They show someone what they’re getting.' },
  { k: 'e', t: 'Replies to reviews', d: 'Every one, good or bad. The next customer reads the reply as well as the review.' },
];

function Plan() {
  if (!GBP) return null;
  /* Caleb, 10 Oct 2026: mention the setup add-on. Read from pricing.js, so
     the sentence goes if the add-on does. */
  const setup = GBP_SETUP && typeof GBP_SETUP.price === 'number' ? GBP_SETUP : null;
  const dominate = has('dominate', /business profile/i);
  return (
    <div className="sc-frame sc-local-plan" id="gbp">
      <div className="sc-local-plan-text">
        <h3 className="sc-h3 sc-local-plan-h" id="sc-local-plan-h">We can keep it current for you</h3>
        <p className="sc-say">
          On {GBP.name}, we look after it every month. You add us to the profile as a manager, so you stay the owner,
          and only owners decide who has access. That&rsquo;s how Google asks outside help to work.
        </p>
        <p className="sc-say">
          Each month we send you the profile&rsquo;s own figures from Google. You&rsquo;ll see how many people viewed
          it and what they searched to find it. You&rsquo;ll also see how often someone tapped to call or asked for
          directions, and how often they clicked through to your site.
        </p>
        <p className="sc-say">
          It won&rsquo;t buy a higher place on the map. Google says no outside company can promise one.
        </p>
      </div>

      <div className="sc-local-plan-buy">
        <div className="sc-ledger sc-ledger--solo">
          <PriceRow p={GBP} idBase="local" />
        </div>
        <p className="sc-step-who">
          {setup
            ? `Google has to verify a profile before most of this works. If yours isn’t set up yet, or needs sorting out first, that’s ${money(setup.price)}, once.`
            : 'Google has to verify a profile before most of this works, so that comes first.'}
        </p>
        {dominate ? <p className="sc-step-who">{`Dominate includes ${GBP.name}’s monthly work.`}</p> : null}
        <p className="sc-step-who">
          Google&rsquo;s rules for what goes in a profile, quoted from its help pages:{' '}
          <Link to="/google-business-profile-rules/">What should go in your Google Business Profile?</Link>
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <section className="sc-sec sc-local" aria-labelledby="sc-local-h">
      <div className="sc-frame sc-local-grid">
        <div className="sc-local-text">
          <h2 className="sc-h2" id="sc-local-h">Your Google Business Profile</h2>
          <p className="sc-say">
            For a local search like &ldquo;{EX.query}&rdquo;, a complete Google Business Profile can do more than the
            website. It&rsquo;s free to have. The work is filling it in properly and keeping it current.
          </p>
          <dl className="sc-keys sc-keys--local">
            {KEYS.map((key) => (
              <div className="sc-key" key={key.k}>
                <dt><span className="sc-key-mark" aria-hidden="true">{key.k}</span>{key.t}</dt>
                <dd>{key.d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="sc-gbp-fig">
          <div className="sc-gbp" data-nosnippet="">
            <div className="sc-gbp-cover">
              <Photo photo={PHOTOS.ute} sizes="(min-width: 1024px) 420px, 90vw" />
            </div>
            <div className="sc-gbp-body">
              <p className="sc-gbp-tag">Example profile</p>
              <p className="sc-gbp-name">{YOU}</p>
              <p className="sc-gbp-cat"><span className="sc-gbp-key" aria-hidden="true">a</span>Electrician</p>
              <div className="sc-gbp-actions" aria-hidden="true">
                <span><Phone size={17} strokeWidth={1.8} />Call</span>
                <span><Navigation size={17} strokeWidth={1.8} />Directions</span>
                <span><Globe size={17} strokeWidth={1.8} />Website</span>
                <span><Share2 size={17} strokeWidth={1.8} />Share</span>
              </div>
              <ul className="sc-gbp-facts">
                <li><MapPin size={16} strokeWidth={1.8} aria-hidden="true" /><span className="sc-gbp-key" aria-hidden="true">b</span>Serves {AREA}</li>
                <li><Clock size={16} strokeWidth={1.8} aria-hidden="true" /><span className="sc-gbp-key" aria-hidden="true">c</span>Open Monday to Friday, 7 am to 4 pm</li>
              </ul>
              <p className="sc-gbp-sub"><span className="sc-gbp-key" aria-hidden="true">d</span>Photos</p>
              <div className="sc-gbp-photos">
                <Photo photo={PHOTOS.switchboard} sizes="160px" alt="An example job photo: a switchboard being tested." />
                <Photo photo={PHOTOS.ute} sizes="160px" alt="An example job photo: the ute on site." />
              </div>
              <div className="sc-gbp-review">
                <p className="sc-gbp-sub"><span className="sc-gbp-key" aria-hidden="true">e</span>Reviews</p>
                <p className="sc-gbp-review-p">
                  <span className="sc-gbp-quote" aria-hidden="true" />
                  <span className="sc-gbp-quote sc-gbp-quote--short" aria-hidden="true" />
                  <span className="sc-gbp-reply">Response from the owner</span>
                  <span className="sc-gbp-quote sc-gbp-quote--reply" aria-hidden="true" />
                </p>
              </div>
            </div>
          </div>
          <figcaption className="sc-cap">
            <span>An example profile for the example business. The details are made up; the photos are real.</span>
            <Credit photo={PHOTOS.ute} label="Cover photo" />
            <Credit photo={PHOTOS.switchboard} label="Job photo" />
          </figcaption>
        </figure>
      </div>

      <Plan />
    </section>
  );
}
