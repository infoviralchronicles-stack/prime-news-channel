export interface AuthorProfile {
  name: string;
  slug: string;
  role: string;
  beat: string;
  bio: string;
  avatar: string;
  location: string;
  credentials: string;
}

export const AUTHORS_DATA: Record<string, AuthorProfile> = {
  'jonathan-vance': {
    name: 'Jonathan Vance',
    slug: 'jonathan-vance',
    role: 'Chief Diplomatic Correspondent',
    beat: 'World Affairs & Geopolitics',
    bio: 'Jonathan Vance has over fifteen years of experience reporting from international diplomatic summits, multilateral assemblies, and sovereign foreign ministries. He specializes in global conflict resolution, non-proliferation treaties, and international humanitarian law.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    location: 'Geneva / New York',
    credentials: 'Senior Fellow in International Relations, Former UN Press Corps',
  },
  'elena-rostova': {
    name: 'Elena Rostova',
    slug: 'elena-rostova',
    role: 'Senior Technology & AI Editor',
    beat: 'Frontier AI, Semiconductors & Computing',
    bio: 'Elena Rostova covers the technical and societal implications of frontier artificial intelligence, quantum acceleration, and semiconductor packaging. Her investigations provide deep technical analysis grounded in verified hardware metrics and algorithmic governance.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    credentials: 'M.Sc. in Computer Engineering, Tech Journalism Laureate',
  },
  'marcus-sterling': {
    name: 'Marcus Sterling',
    slug: 'marcus-sterling',
    role: 'Lead Financial & Economics Analyst',
    beat: 'Global Markets, Central Banks & Sovereign Debt',
    bio: 'Marcus Sterling specializes in macroeconomics, international bond markets, and monetary policy synchronization. Prior to journalism, he served as a fixed-income portfolio strategist across institutional European banking desks.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    location: 'London, UK',
    credentials: 'Chartered Financial Analyst (CFA), M.A. in Macroeconomics',
  },
  'dr-rachel-bennett': {
    name: 'Dr. Rachel Bennett',
    slug: 'dr-rachel-bennett',
    role: 'Senior Medical & Health Correspondent',
    beat: 'Clinical Medicine, Epidemiology & Biotech',
    bio: 'Dr. Rachel Bennett reports on transformative medical breakthroughs, oncology clinical trials, and global public health policy. She works closely with international health organizations to deliver rigorous, peer-reviewed medical journalism.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    location: 'Boston, MA',
    credentials: 'M.D., Public Health Fellow (MPH), Certified Clinical Researcher',
  },
  'nathan-cross': {
    name: 'Nathan Cross',
    slug: 'nathan-cross',
    role: 'Sports Analytics & Tech Director',
    beat: 'Sports Science, Biomechanics & Motor Racing',
    bio: 'Nathan Cross covers the convergence of elite athletics, biometric telemetry, and high-performance engineering. His dispatches take readers inside Formula One paddocks, European football analytics rooms, and cutting-edge sports biomechanics labs.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    location: 'Monaco / London',
    credentials: 'B.Sc. in Sports Physiology & Data Analytics',
  },
  'sarah-jenkins': {
    name: 'Sarah Jenkins',
    slug: 'sarah-jenkins',
    role: 'Global Markets & Corporate Governance Reporter',
    beat: 'Commercial Banking & Corporate Strategy',
    bio: 'Sarah Jenkins delivers investigative reporting on corporate refinancing, cross-border mergers, and industrial regulatory compliance across global commercial epicenters.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    location: 'New York, NY',
    credentials: 'Columbia Journalism School Alum, Economics Honors',
  },
  'david-vance': {
    name: 'David Vance',
    slug: 'david-vance',
    role: 'Astrophysics & Deep Space Correspondent',
    beat: 'Space Exploration, Planetary Science & Observatories',
    bio: 'David Vance writes on deep-space interferometry, exoplanet spectroscopy, and orbital exploration programs, linking complex astrophysics research with clear, engaging broadsheet reporting.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    location: 'Pasadena, CA',
    credentials: 'Former Aerospace Systems Specialist',
  },
  'julian-sterling': {
    name: 'Julian Sterling',
    slug: 'julian-sterling',
    role: 'Senior Investigative Correspondent',
    beat: 'Energy Infrastructure & Public Policy',
    bio: 'Julian Sterling focuses on large-scale utility transitions, high-voltage power networks, and critical civil infrastructure modernization worldwide.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    location: 'Chicago, IL',
    credentials: 'Polity & Energy Economics Fellow',
  }
};

export function getAuthorSlug(name: string): string {
  if (!name) return 'editorial-team';
  return name
    .toLowerCase()
    .replace(/^dr\.\s*/i, 'dr-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getAuthorProfile(nameOrSlug: string): AuthorProfile {
  const slug = getAuthorSlug(nameOrSlug);
  if (AUTHORS_DATA[slug]) {
    return AUTHORS_DATA[slug];
  }
  
  // Clean fallback for any other name
  const displayName = nameOrSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    name: displayName,
    slug,
    role: 'Contributing Staff Correspondent',
    beat: 'Global Journalism & Field Reporting',
    bio: `${displayName} is an investigative correspondent reporting on key international dispatches, policy developments, and market trends for Prime News Channel.`,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    location: 'Prime Newsroom Bureau',
    credentials: 'Prime News Channel Verified Byline',
  };
}
