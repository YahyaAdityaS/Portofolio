import { Testimonial } from '../types';

export type { Testimonial };

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    name: 'Ahmad Fauzi',
    role: 'Engineering Lead',
    company: 'Tech Innovators ID',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    content: 'Yahya combines architectural rigor with an eye for interface fluidity that is exceptionally rare. Delivery was prompt and code quality was enterprise-grade.',
    projectWorkedOn: 'Karsa Design System',
  },
  {
    id: 't-2',
    name: 'Budi Santoso',
    role: 'Product Director',
    company: 'FinFlow Asia',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    content: 'Our transaction portal experienced a 4x reduction in load times and unprecedented user retention after Yahya re-architected our frontend.',
    projectWorkedOn: 'FinFlow Portal',
  },
];
