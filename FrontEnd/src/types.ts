export type Category = 
  | 'AI' 
  | 'IT' 
  | 'Cars' 
  | 'Culture' 
  | 'Gaming' 
  | 'Health' 
  | 'Policy' 
  | 'Science' 
  | 'Security' 
  | 'Business' 
  | 'Space' 
  | 'Gadgets';

export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  link: string;
  category: Category;
  date: string;
}

export interface NewsResponse {
  [key: string]: {
    title: string;
    summary: string;
    image: string;
    url: string;
  }[];
}