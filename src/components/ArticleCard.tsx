import React from 'react';
import { ExternalLink, Bookmark, User, Calendar, Globe, Tag } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSaveClick: () => void;
  isSaved?: boolean;
}

export function ArticleCard({ article, onSaveClick, isSaved }: ArticleCardProps) {
  return (
    <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {article.category}
          </span>
          <button
            onClick={onSaveClick}
            className={`p-2 rounded-full transition-colors ${
              isSaved
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800/90 text-gray-300 hover:text-white'
            }`}
          >
            <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 line-clamp-3 leading-tight">
          {article.title}
        </h3>
        
        <p className="text-gray-300 mb-4 line-clamp-3">{article.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <User size={16} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar size={16} />
            <span>{article.published}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Globe size={16} />
            <span>{article.source}</span>
          </div>
          {article.topics.length > 0 && (
            <div className="flex items-center gap-2 text-gray-400 text-sm flex-wrap">
              <Tag size={16} />
              <div className="flex gap-1 flex-wrap">
                {article.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-gray-700/50 px-2 py-0.5 rounded-full text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
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