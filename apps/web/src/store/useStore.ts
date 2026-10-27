import { create } from 'zustand';
import i18n from '../i18n';

interface UserProfile {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  demographic_cohort?: string;
  persona_cluster?: number;
}

interface AppState {
  theme: 'dark' | 'light';
  language: 'en' | 'hi';
  token: string | null;
  user: UserProfile | null;
  isNotificationsOpen: boolean;
  activeDomainFilter: string;
  
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
  setNotificationsOpen: (open: boolean) => void;
  setActiveDomainFilter: (domain: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',
  language: (localStorage.getItem('language') as 'en' | 'hi') || 'en',
  token: localStorage.getItem('access_token') || 'demo_token_active',
  user: {
    user_id: '00000000-0000-0000-0000-000000000001',
    email: 'demo@lifestack.ai',
    full_name: 'Aarav Sharma',
    role: 'user',
    demographic_cohort: 'early_career_tech',
    persona_cluster: 1
  },
  isNotificationsOpen: false,
  activeDomainFilter: 'all',

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    set({ language: lang });
  },

  setAuth: (token, user) => {
    localStorage.setItem('access_token', token);
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null, user: null });
  },

  setNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  setActiveDomainFilter: (domain) => set({ activeDomainFilter: domain })
}));
