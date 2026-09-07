import { API_URL } from "./api";

export interface HomeContent {
  name: string;
  title: string;
  tagline: string;
  bio: string;
}

export interface Pillar {
  title: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  start: string;
  end: string;
}

export interface AboutContent {
  bio: string;
  pillars: Pillar[];
  skills: string[];
  education: EducationItem[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  start: string;
  end: string;
  description: string;
}

export interface ExperienceContent {
  items: ExperienceItem[];
}

export interface ProjectItem {
  title: string;
  description: string;
  link: string;
}

export interface ProjectsContent {
  items: ProjectItem[];
}

export interface ContactContent {
  email: string;
  linkedin: string;
  github: string;
}

export type PageContentMap = {
  home: HomeContent;
  about: AboutContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  contact: ContactContent;
};

export async function getPageContent<K extends keyof PageContentMap>(
  page: K,
): Promise<PageContentMap[K] | null> {
  try {
    const res = await fetch(`${API_URL}/api/pages/${page}`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data as PageContentMap[K];
  } catch {
    return null;
  }
}
