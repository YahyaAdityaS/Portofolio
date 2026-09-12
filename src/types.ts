export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: 'web' | 'mobile' | 'creative' | 'ai';
  categoryLabel: string;
  year: string;
  role: string;
  deliverables: string[];
  metrics?: { label: string; value: string }[];
  tags: string[];
  image: string;
  secondaryImage?: string;
  accentColor: string; // e.g., '#1D4ED8' or '#CCFF00' or '#A78BFA'
  accentText: string;
  featured?: boolean;
  colSpanDesktop: 8 | 4 | 6 | 12;
  liveUrl?: string;
  githubUrl?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: {
    name: string;
    level: string; // 'Expert' | 'Advanced' | 'Proficient'
    iconName: string;
    description: string;
    hotTag?: boolean;
  }[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  type: string; // 'Full-time' | 'Contract' | 'Lead'
  description: string;
  highlights: string[];
  technologies: string[];
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  projectWorkedOn: string;
  rating: number;
}
