export const TESTIMONIALS = [
  {
    id: 1,
    quote: "I want to give a huge shoutout to Caleb for building Transform Fremantle's website. The design is clear, engaging and easy to navigate - honestly far better than anything I could have created myself. He really understood what I was trying to achieve and turned it into something that looks professional and works beautifully. I'm genuinely impressed with the quality and attention to detail. If anyone needs a website done, I can't recommend him enough.",
    name: 'Liz',
    role: 'Founder of Transform Freo',
    caseStudySlug: 'transform-fremantle',
    featured: true,
  },
  {
    id: 2,
    quote: "A big thank you to Caleb for creating the Transform Hakea website for me. The website is clear, engaging and easy to navigate. He really understood what I was looking for and turned it into something that looks professional and polished. I am also amazed at how quickly it was completed without sacrificing quality. I'm extremely grateful and would happily recommend him to anyone needing a great website!",
    name: 'Liz',
    role: 'Founder of Transform Hakea',
    caseStudySlug: 'transform-hakea',
    featured: true,
  },
  {
    id: 3,
    quote: "A huge thank you for such an inspiring consultation. My website is now incredibly fast, modern and finally has the functionality I've been trying to achieve for years. The results are outstanding. Brilliant job.",
    name: 'Collin',
    role: 'GoCC',
    caseStudySlug: 'gocc',
    featured: true,
  },
  {
    id: 4,
    quote: "The only thing I regret is not hiring Caleb sooner. After struggling with a useless website that was doing nothing for our business, we bit the bullet and reached out for help, not quite knowing what to expect. Well, we couldn't have been happier with the result! We are so happy with our new website and truly thank you for making this such a stress-free experience. The timeline was clear, and we knew exactly what we were getting: ideas, design, inclusions, additions and changes. This was all accomplished with prompt communication that was friendly and professional, especially when dealing with someone who is admittedly not technologically inclined, and we didn't go live until we were 100% happy. We never felt pressured, pushed or worried the entire time. Outstanding service at a reasonable cost. We would recommend you to everyone without hesitation. Thank you so much for helping us put the vision online!",
    name: 'Shelley',
    role: 'Jurassic PT',
    caseStudySlug: 'jurassic-pt',
    featured: true,
  },
];

export function getFeaturedTestimonials() {
  return TESTIMONIALS.filter((testimonial) => testimonial.featured);
}

export function getAllTestimonials() {
  return TESTIMONIALS;
}
