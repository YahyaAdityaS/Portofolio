import { ExperienceItem } from '../types';

export type { ExperienceItem };

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Full-Stack & UI Systems Architect',
    company: 'Independent Studio / Freelance',
    location: 'Remote, ID',
    period: '2024 — Present',
    type: 'Lead Engineer',
    featured: true,
    description: 'Architecting scalable web applications, bespoke design token libraries, and sub-second full-stack experiences.',
    highlights: [
      'Delivered 15+ high-stakes web systems with 99.2% Lighthouse averages',
      'Designed end-to-end token systems unifying Figma and codebases',
    ],
    technologies: ['React 19', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'FastAPI'],
  },
  {
    id: 'exp-2',
    role: 'UI/UX Design & Frontend Intern',
    company: 'Infotact Solutions',
    location: 'Remote',
    period: '2025 — 2026',
    type: 'Internship',
    featured: false,
    description: 'Built interactive dashboard prototypes, audited WCAG accessibility compliance, and engineered modular React component kits.',
    highlights: [
      'Standardized component token systems across client portfolios',
      'Boosted developer velocity through modular UI kits',
    ],
    technologies: ['Figma', 'React', 'Design Ops', 'Prototyping'],
  },
];
