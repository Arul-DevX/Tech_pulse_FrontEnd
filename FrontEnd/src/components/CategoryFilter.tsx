import React from 'react';
import { Brain, Monitor, Car, Theater, Gamepad2, Heart, Scale, FlaskRound as Flask, Shield, Building2, Rocket, Smartphone } from 'lucide-react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  AI: <Brain className="w-4 h-4" />,
  IT: <Monitor className="w-4 h-4" />,
  Cars: <Car className="w-4 h-4" />,
  Culture: <Theater className="w-4 h-4" />,
  Gaming: <Gamepad2 className="w-4 h-4" />,
  Health: <Heart className="w-4 h-4" />,
  Policy: <Scale className="w-4 h-4" />,
  Science: <Flask className="w-4 h-4" />,
  Security: <Shield className="w-4 h-4" />,
  Business: <Building2 className="w-4 h-4" />,
  Space: <Rocket className="w-4 h-4" />,
  Gadgets: <Smartphone className="w-4 h-4" />
};

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
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