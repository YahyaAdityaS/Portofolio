export interface ProjectItem {
  id: string;
  category: 'all' | 'fullstack' | 'backend' | 'designsystem' | string;
  year: string;
  badge: string;
  badgeBg?: string;
  badgeText?: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  status: string;
  actionText?: string;
  type?: 'plagin' | 'karsa' | 'finflow' | 'nusantara' | string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  github?: string;
  demo?: string;
  liveUrl?: string;
  [key: string]: any;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'ui-design-system',
    category: 'UI/UX Design',
    year: '2026',
    badge: 'UI System',
    badgeBg: 'bg-primary text-on-primary',
    badgeText: 'bg-primary-container',
    title: 'UI Design System',
    subtitle: 'Atomic Design Token Architecture',
    description: 'Perancangan sistem desain (Design System) berbasis Atomic Design yang terukur dari awal untuk standarisasi multi-produk digital.',
    tags: ['UI System', 'UI/UX Design', 'Figma Tokens'],
    status: 'Live Design System',
    actionText: 'Lihat Detail',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'manufacturing-production',
    category: 'UI/UX Design',
    year: '2026',
    badge: 'Manufacturing',
    badgeBg: 'bg-secondary text-on-secondary',
    badgeText: 'bg-secondary-container',
    title: 'Manufacturing Production Monitoring',
    subtitle: 'Industrial Monitoring Dashboard',
    description: 'Perancangan antarmuka sistem pemantauan produksi manufaktur untuk efisiensi tracking output dan monitoring operasional pabrik.',
    tags: ['UI System', 'UI/UX Design', 'Dashboard'],
    status: 'Operational System',
    actionText: 'Lihat Detail',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'custom-portfolio-web',
    category: 'Web Development',
    year: '2026',
    badge: 'Web App',
    badgeBg: 'bg-tertiary text-on-tertiary',
    badgeText: 'bg-tertiary-container',
    title: 'Custom Portofolio Web',
    subtitle: 'Interactive Modern Portfolio',
    description: 'Pembuatan desain antarmuka dan implementasi web portofolio kustom interaktif dengan arsitektur modern dan integrasi data.',
    tags: ['Web Development', 'UI/UX Design', 'React'],
    status: 'Production Release',
    actionText: 'Lihat Detail',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  }
];

export interface ExperienceItem {
  number: string;
  role: string;
  badge: string;
  badgeClass: string;
  company: string;
  description: string;
  tag: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    number: '01',
    role: 'UI/UX Design Intern',
    badge: 'Aktif / 2026',
    badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
    company: 'Infotact Solutions • Remote',
    description: 'Mengembangkan komponen UI terstandarisasi, flow prototipe interaktif untuk dashboard klien enterprise, dan audit aksesibilitas antarmuka pengguna.',
    tag: 'Figma • Prototyping'
  },
  {
    number: '02',
    role: 'UI Design System Developer',
    badge: '2025',
    badgeClass: 'bg-surface-container-high text-on-surface',
    company: 'Machine Vision Indonesia • Hybrid',
    description: 'Membangun tokenisasi desain dan implementasi library komponen berbasis Tailwind CSS & React untuk sistem monitoring komputer visi industri manufaktur.',
    tag: 'Design Ops • React'
  },
  {
    number: '03',
    role: 'Software Engineering Graduate',
    badge: '2023 - 2024',
    badgeClass: 'bg-surface-container-high text-on-surface',
    company: 'SMK Telkom Malang • Malang, Jawa Timur',
    description: 'Fokus kompetensi pada Rekayasa Perangkat Lunak, algoritma struktur data, pemrograman berorientasi objek, basis data relasional, dan metodologi Agile Scrum.',
    tag: 'Lulusan Terbaik RPL'
  }
];

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
  initialsBg: string;
  initialsText: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: '“Yahya mampu menerjemahkan rancangan antarmuka yang sangat kompleks menjadi implementasi Tailwind dan React tanpa kehilangan detail estetika sedikit pun. Kecepatan kerjanya luar biasa.”',
    name: 'Rian Ardiansyah',
    role: 'Lead Product Designer • Infotact',
    initials: 'RA',
    initialsBg: 'bg-primary',
    initialsText: 'text-on-primary'
  },
  {
    quote: '“Arsitektur kode FastAPI yang disusun untuk proyek evaluasi semantik kami sangat bersih. Skemanya rapi, dokumentasi OpenAPI otomatis lengkap, dan mudah dimaintain oleh tim internal.”',
    name: 'Dimas Kurniawan',
    role: 'Engineering Manager • TechLab',
    initials: 'DK',
    initialsBg: 'bg-secondary-fixed',
    initialsText: 'text-on-secondary-fixed'
  },
  {
    quote: '“Etos kerja dan ketepatan waktu delivery Yahya sangat teruji sejak di SMK Telkom Malang. Menyenangkan sekali berkolaborasi dengan developer yang memahami design logic secara mendalam.”',
    name: 'Fauzan Wicaksono',
    role: 'Senior Frontend Engineer',
    initials: 'FW',
    initialsBg: 'bg-tertiary-fixed',
    initialsText: 'text-on-tertiary-fixed'
  }
];
