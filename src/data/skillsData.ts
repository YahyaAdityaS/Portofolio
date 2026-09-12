import { SkillCategory } from '../types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Core',
    skills: [
      { name: 'TypeScript', level: 'Expert', iconName: 'Code2', description: 'Type-level gymnastics, strict typing, scalable codebases', hotTag: true },
      { name: 'React 19 & Next.js', level: 'Expert', iconName: 'Layers', description: 'Server components, hooks, concurrent rendering, state machines', hotTag: true },
      { name: 'Tailwind CSS v4', level: 'Expert', iconName: 'Palette', description: 'Neo-brutalist bento layouts, fluid typography, zero-runtime styles', hotTag: true },
      { name: 'Framer Motion', level: 'Expert', iconName: 'Sparkles', description: 'Kinetic spring physics, layout animations, gesture controls' },
      { name: 'Vue 3 & Svelte', level: 'Proficient', iconName: 'Cpu', description: 'Reactivity primitives, component lifecycles, micro-frontends' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative & 3D Web',
    skills: [
      { name: 'Three.js & WebGL', level: 'Advanced', iconName: 'Box', description: '3D scenes, custom shaders, GLSL material lighting', hotTag: true },
      { name: 'Canvas 2D & D3.js', level: 'Advanced', iconName: 'BarChart2', description: 'High-density telemetry graphs, interactive data visualizers' },
      { name: 'WebAudio API', level: 'Proficient', iconName: 'Activity', description: 'Procedural audio synthesis, haptic feedback hooks' },
      { name: 'Figma Tokens & Design Ops', level: 'Expert', iconName: 'Compass', description: 'Token translation pipelines, component documentation' }
    ]
  },
  {
    id: 'backend-cloud',
    name: 'Full-Stack & Cloud',
    skills: [
      { name: 'Node.js & Bun', level: 'Advanced', iconName: 'Terminal', description: 'High-throughput APIs, streaming responses, CLI tooling' },
      { name: 'PostgreSQL & Redis', level: 'Advanced', iconName: 'Database', description: 'Relational data modeling, indexing, caching strategies' },
      { name: 'GraphQL & REST', level: 'Expert', iconName: 'Share2', description: 'Schema stitching, Apollo client, caching, optimistic UI' },
      { name: 'Docker & CI/CD', level: 'Proficient', iconName: 'Container', description: 'Automated test workflows, Docker containerization, edge deploys' }
    ]
  },
  {
    id: 'performance',
    name: 'Engineering Philosophy',
    skills: [
      { name: '100 Core Web Vitals', level: 'Expert', iconName: 'Zap', description: 'Zero layout shift, instant INP, sub-second LCP', hotTag: true },
      { name: 'WCAG AAA Accessibility', level: 'Expert', iconName: 'Eye', description: 'Keyboard navigation, screen-reader semantics, contrast math' },
      { name: 'System Architecture', level: 'Advanced', iconName: 'Workflow', description: 'Maintainable monorepos, modular decoupling, DRY principles' }
    ]
  }
];
