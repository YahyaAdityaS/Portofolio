export interface ProjectItem {
  id: string;
  category: 'all' | 'fullstack' | 'backend' | 'designsystem' | string;
  categoryLabel?: string;
  year: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  title: string;
  subtitle?: string;
  description: string;
  role?: string;
  tags: string[];
  status?: string;
  actionText?: string;
  type?: string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  github?: string;
  demo?: string;
  liveUrl?: string;
  colSpanDesktop?: number;
  metrics?: { label: string; value: string }[];
  [key: string]: any;
}

export type Project = ProjectItem;

export interface CertificateItem {
  id: string;
  title: string;
  desc?: string;
  description?: string;
  category: 'Design' | 'Tech' | 'Business & Skills' | string;
  tags: string[];
  image: string;
  imageUrl?: string;
  year?: string;
  badge?: string;
  issuer?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  stars: number;
  quote: string;
  avatar: string;
  avatarBg: string;
  avatarText: string;
  approved: boolean;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  projectWorkedOn: string;
}

export interface SkillItem {
  name: string;
  level: 'Expert' | 'Advanced' | 'Proficient';
  iconName: string;
  description: string;
  hotTag?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  featured?: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
}