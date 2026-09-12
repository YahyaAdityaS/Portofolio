import { ExperienceItem } from '../types';

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    period: '2023 — PRESENT',
    role: 'Lead Creative Engineer & Architect',
    company: 'Veloce Labs Global',
    location: 'Remote / Singapore',
    type: 'Lead Role',
    description: 'Directing the architecture of next-generation interactive web products and high-speed web application frontends for Fortune 500 tech firms.',
    highlights: [
      'Architected internal React bento design system serving 14 distributed engineering squads.',
      'Reduced average first-contentful-paint across core products by 42% via tree-shaking & asset budgeting.',
      'Mentored 8 senior engineers in WebGL performance and micro-interaction engineering.'
    ],
    technologies: ['React 19', 'TypeScript', 'Tailwind', 'Three.js', 'Framer Motion'],
    featured: true
  },
  {
    id: 'exp-2',
    period: '2021 — 2023',
    role: 'Senior Frontend Developer',
    company: 'Stratum FinTech Systems',
    location: 'Jakarta / Remote',
    type: 'Full-time',
    description: 'Spearheaded the flagship multi-currency merchant platform and real-time transaction processing cockpit.',
    highlights: [
      'Built financial charting module rendering 60fps canvas updates during peak market volatility.',
      'Created automated regression visual testing suite slashing UI bugs in production by 65%.'
    ],
    technologies: ['TypeScript', 'Next.js', 'Tailwind', 'D3.js', 'WebSockets']
  },
  {
    id: 'exp-3',
    period: '2019 — 2021',
    role: 'Interactive UI/UX Engineer',
    company: 'Studio Kinetic',
    location: 'Bandung / On-site',
    type: 'Agency',
    description: 'Crafted award-winning marketing platforms, 3D interactive microsites, and bespoke brand experiments for global tech startups.',
    highlights: [
      'Won 3 Awwwards Site of the Day accolades for experimentalWebGL interaction microsites.',
      'Collaborated closely with art directors to translate complex 3D keyframes into smooth web animations.'
    ],
    technologies: ['Vue.js', 'WebGL', 'GSAP', 'CSS Modules', 'Blender']
  }
];
