import { SkillItem, SkillCategory } from '../types';

export type { SkillItem, SkillCategory };

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    skills: [
      {
        name: 'React 19 & Next.js 14',
        level: 'Expert',
        iconName: 'Code2',
        description: 'Server Actions, App Router, Suspense streaming, and optimistic state synchronization.',
        hotTag: true,
      },
      {
        name: 'TypeScript & Type Systems',
        level: 'Expert',
        iconName: 'Terminal',
        description: 'Strict typing, generic inference, and zero-compromise architectural contracts.',
        hotTag: true,
      },
      {
        name: 'Tailwind CSS v4',
        level: 'Expert',
        iconName: 'Palette',
        description: 'Bespoke @theme tokenization, CSS variable binding, and fluid responsive layouts.',
      },
      {
        name: 'Motion & Micro-interactions',
        level: 'Advanced',
        iconName: 'Sparkles',
        description: 'Kinetic spring physics, layout animations, and gesture-driven delight.',
      },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Cloud',
    skills: [
      {
        name: 'FastAPI & Python',
        level: 'Advanced',
        iconName: 'Cpu',
        description: 'Asynchronous workers, typed schemas, and high-throughput microservices.',
        hotTag: true,
      },
      {
        name: 'PostgreSQL & Databases',
        level: 'Advanced',
        iconName: 'Database',
        description: 'Relational data modeling, index optimization, and transaction safety.',
      },
      {
        name: 'Node.js & Express',
        level: 'Advanced',
        iconName: 'Layers',
        description: 'RESTful API routing, JWT authentication, and resilient server middleware.',
      },
    ],
  },
];
