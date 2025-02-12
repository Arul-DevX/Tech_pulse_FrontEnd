import React, { useState, useEffect } from 'react';
import { Newspaper, Loader2 } from 'lucide-react';
import { ArticleCard } from './components/ArticleCard';
import { CategoryFilter } from './components/CategoryFilter';
import { Article, Category, NewsResponse } from './types';

const categories: Category[] = [
  'AI', 'IT', 'Cars', 'Culture', 'Gaming', 'Health',
  'Policy', 'Science', 'Security', 'Business', 'Space', 'Gadgets'
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [visibleArticles, setVisibleArticles] = useState(5);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/news/all');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data: NewsResponse = await response.json();
        
        // Transform the data into our Article format
        const transformedArticles: Article[] = Object.entries(data).flatMap(
          ([category, articles]) =>
            articles.map((article, index) => ({
              id: `${category}-${index}`,
              title: article.title,
              summary: article.summary,
              imageUrl: article.image,
              link: article.url,
              category: category as Category,
              date: new Date().toISOString().split('T')[0] // Current date as we don't get it from the API
            }))
        );

        setArticles(transformedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredArticles = articles.filter(
    article => article.category === selectedCategory
  );

  const handleLoadMore = () => {
    setVisibleArticles(prev => prev + 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">TechPulse</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-8 bg-gray-800 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.slice(0, visibleArticles).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {filteredArticles.length > visibleArticles && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <a
            href="https://arstechnica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-400 transition-colors duration-200 text-sm"
          >
            News content provided by arstechnica.com
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;