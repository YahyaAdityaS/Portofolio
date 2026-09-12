export interface ProjectItem {
  id: string;
  category: 'all' | 'fullstack' | 'backend' | 'designsystem';
  year: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: string;
  actionText: string;
  type: 'plagin' | 'karsa' | 'finflow' | 'nusantara';
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'plag-in',
    category: 'backend',
    year: '2025',
    badge: 'Smart Analysis Tool',
    badgeBg: 'bg-primary text-on-primary',
    badgeText: 'bg-primary-container',
    title: 'Plag-In • Deteksi Semantik & Analisis Dokumen',
    subtitle: 'Aplikasi komputasi bahasa alami',
    description: 'Aplikasi komputasi bahasa alami berbasis FastAPI & TF-IDF vectorizer untuk mendeteksi kesamaan konten akademik dan duplikasi karya tulis secara real-time.',
    tags: ['Python FastAPI', 'Next.js 14', 'Supabase Vector', 'Redis'],
    status: 'Full Production Deployment',
    actionText: 'Detail Arsitektur',
    type: 'plagin'
  },
  {
    id: 'karsa-tokens',
    category: 'designsystem',
    year: '2025',
    badge: 'Design Systems • Multi-brand',
    badgeBg: 'bg-tertiary text-on-tertiary',
    badgeText: 'bg-tertiary-container',
    title: 'Karsa UI Tokens • Enterprise Token Pipeline',
    subtitle: 'Pipa otomasi sinkronisasi token desain',
    description: 'Pipa otomasi sinkronisasi token desain dari Figma langsung ke CSS variable, JSON token generator, dan utility class Tailwind untuk konsistensi ekosistem multi-produk.',
    tags: ['Design Tokens', 'Tailwind Preset', 'GitHub Actions', 'Figma API'],
    status: 'DesignOps Open Tool',
    actionText: 'Jelajahi Repositori',
    type: 'karsa'
  },
  {
    id: 'finflow',
    category: 'fullstack',
    year: '2024',
    badge: 'Fintech Analytics Dashboard',
    badgeBg: 'bg-inverse-surface text-inverse-on-surface',
    badgeText: 'bg-surface-container-lowest/10 text-inverse-on-surface',
    title: 'FinFlow • Telemetri Finansial Korporat',
    subtitle: 'Pusat kendali keuangan enterprise',
    description: 'Pusat kendali keuangan enterprise dengan integrasi data transaksi perbankan, rekonsiliasi otomatis, dan visualisasi interaktif performa tinggi.',
    tags: ['Next.js', 'Tailwind CSS', 'Recharts', 'Zod Validation'],
    status: 'Interactive Demo Tersedia',
    actionText: 'Live Preview',
    type: 'finflow'
  },
  {
    id: 'nusantara-store',
    category: 'fullstack',
    year: '2024',
    badge: 'E-Commerce Marketplace',
    badgeBg: 'bg-surface-container-highest text-on-surface',
    badgeText: 'bg-surface-container-lowest',
    title: 'Nusantara Store • Marketplace Kriya Lokal',
    subtitle: 'Platform kurasi produk perajin nusantara',
    description: 'Platform kurasi produk perajin nusantara lengkap dengan keranjang belanja interaktif, kalkulasi ongkir ekspedisi live, dan payment gateway multi-kanal.',
    tags: ['Full-Stack TS', 'PostgreSQL', 'Midtrans API', 'RajaOngkir'],
    status: 'Studi Kasus Lengkap',
    actionText: 'Buka Studi Kasus',
    type: 'nusantara'
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
