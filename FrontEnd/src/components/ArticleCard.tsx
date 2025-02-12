import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {article.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-3">
          {article.summary}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">
            {article.date}
          </span>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Read More
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}