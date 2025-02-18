export type Category = 
  | 'AI'
  | 'Apps'
  | 'Security'
  | 'Climate'
  | 'Cloud Computing'
  | 'Gadgets'
  | 'Gaming'
  | 'Space'
  | 'Government Policy'
  | 'Layoffs'
  | 'privacy'
  | 'Social'
  | 'Media Entertainment'
  | 'Crypto Currency'
  | 'Robotics'
  | 'Startups'
  | 'Enterprise'
  | 'Commerce'
  | 'Biotech Health';

export interface Article {
  id: string;
  title: string;
  description: string;
  summary?: string;
  imageUrl: string;
  link: string;
  category: Category;
  topics: string[];
  author: string;
  published: string;
  source: string;
}

export interface NewsResponse {
  news: {
    title: string;
    link: string;
    description: string;
    author: string;
    published: string;
    image: string;
    topics: string[];
    category: string;
    source: string;
  }[];
  topics: string[];
}