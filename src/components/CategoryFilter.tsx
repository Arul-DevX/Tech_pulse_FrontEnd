import React from 'react';
import { Brain, AppWindow, Shield, Leaf, Cloud, Smartphone, Gamepad2, Rocket, Building2, UserMinus2, Lock, Users, Film, Bitcoin, Notebook as Robot, Lightbulb, Factory, ShoppingCart, Heart, Clock } from 'lucide-react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categoryIcons: Record<Category | 'Latest', React.ReactNode> = {
  Latest: <Clock className="w-4 h-4" />,
  AI: <Brain className="w-4 h-4" />,
  Apps: <AppWindow className="w-4 h-4" />,
  Security: <Shield className="w-4 h-4" />,
  Climate: <Leaf className="w-4 h-4" />,
  'Cloud Computing': <Cloud className="w-4 h-4" />,
  Gadgets: <Smartphone className="w-4 h-4" />,
  Gaming: <Gamepad2 className="w-4 h-4" />,
  Space: <Rocket className="w-4 h-4" />,
  'Government Policy': <Building2 className="w-4 h-4" />,
  Layoffs: <UserMinus2 className="w-4 h-4" />,
  privacy: <Lock className="w-4 h-4" />,
  Social: <Users className="w-4 h-4" />,
  'Media Entertainment': <Film className="w-4 h-4" />,
  'Crypto Currency': <Bitcoin className="w-4 h-4" />,
  Robotics: <Robot className="w-4 h-4" />,
  Startups: <Lightbulb className="w-4 h-4" />,
  Enterprise: <Factory className="w-4 h-4" />,
  Commerce: <ShoppingCart className="w-4 h-4" />,
  'Biotech Health': <Heart className="w-4 h-4" />
};

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelectCategory('Latest' as Category)}
        className={`category-button flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
          selectedCategory === 'Latest'
            ? 'active bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        {categoryIcons.Latest}
        Latest
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`category-button flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
            selectedCategory === category
              ? 'active bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {categoryIcons[category]}
          {category}
        </button>
      ))}
    </div>
  );
}