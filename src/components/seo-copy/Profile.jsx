/*
 * Local search: a Google Business Profile, shown as an example card for the
 * example business, with the parts that make it complete keyed beside it.
 *
 * The card is ours, drawn in the bench's type; it isn't a copy of Google's
 * screen and carries no rating, review count or figure. Its words are the
 * example's (examples.js) and it says it's an example. The two photos on it
 * are real photographs (photos.jsx). Which plan manages a profile is read
 * from pricing.js; if that feature line goes, the sentence goes with it.
 */
import { Globe, MapPin, Navigation, Phone, Clock, Share2 } from 'lucide-react';
import { PHOTOS, Photo, Credit } from './photos';
import { EXAMPLES, YOU } from './examples';
import { has, whoDoes, list } from './plans';

const EX = EXAMPLES[0];
const AREA = 'Joondalup and the northern suburbs';

const KEYS = [
  { k: 'a', t: 'The right category', d: 'The trade, named the way people search for it. It’s a big part of which searches the profile turns up in.' },
  { k: 'b', t: 'Where you work', d: 'A service area that matches the jobs you actually take.' },
  { k: 'c', t: 'Hours that are right', d: 'Including public holidays, so nobody drives over to a locked door.' },
  { k: 'd', t: 'Photos of real jobs', d: 'Your ute, your work, added as you go. They show someone what they’re getting.' },
  { k: 'e', t: 'Replies to reviews', d: 'Every one, good or bad. The next customer reads the reply as well as the review.' },
];

export default function Profile() {
  const managed = has('dominate', /gbp|business profile/i);
  const who = whoDoes(/gbp|business profile/i);
  return (
    <section className="sc-sec sc-local" aria-labelledby="sc-local-h">
      <div className="sc-frame sc-local-grid">
        <div className="sc-local-text">
          <h2 className="sc-h2" id="sc-local-h">Your Google Business Profile</h2>
          <p className="sc-say">
            For a local search like &ldquo;{EX.query}&rdquo;, a complete Google Business Profile can do more than the
            website. It&rsquo;s free to have. The work is filling it in properly and keeping it current.
          </p>
          {managed && who.length ? (
            <p className="sc-step-who">{`${list(who)} manage${who.length > 1 ? '' : 's'} your profile as part of the plan.`}</p>
          ) : null}
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
    </section>
  );
}
