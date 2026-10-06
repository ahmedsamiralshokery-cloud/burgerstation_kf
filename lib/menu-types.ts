export interface MenuItem {
  id: string;
  cat: string;
  ar: string;
  en: string;
  p1: number;
  p2: number | null;
  img: string;
}

export interface MenuCategory {
  id: string;
  ar: string;
  en: string;
  sized: boolean;
  emoji: string;
}

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
}
