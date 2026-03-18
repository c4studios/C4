export const TESTIMONIALS = [
  {
    id: 1,
    quote: "I want to give a huge shoutout to Caleb for building Transform Fremantle's website. The design is clear, engaging and easy to navigate - honestly far better than anything I could have created myself. He really understood what I was trying to achieve and turned it into something that looks professional and works beautifully. I'm genuinely impressed with the quality and attention to detail. If anyone needs a website done, I can't recommend him enough.",
    name: 'Liz',
    role: 'Founder of Transform Freo',
    featured: true,
  },
  {
    id: 2,
    quote: "A big thank you to Caleb for creating the Transform Hakea website for me. The website is clear, engaging and easy to navigate. He really understood what I was looking for and turned it into something that looks professional and polished. I am also amazed at how quickly it was completed without sacrificing quality. I'm extremely grateful and would happily recommend him to anyone needing a great website!",
    name: 'Liz',
    role: 'Founder of Transform Hakea',
    featured: true,
  },
];

export function getFeaturedTestimonials() {
  return TESTIMONIALS.filter((testimonial) => testimonial.featured);
}

export function getAllTestimonials() {
  return TESTIMONIALS;
}
