import React, { useState, useEffect } from 'react';
import { Newspaper, Loader2, BookmarkIcon, Menu, X, LogOut, LogIn, UserPlus, RefreshCw } from 'lucide-react';
import { ArticleCard } from './components/ArticleCard';
import { CategoryFilter } from './components/CategoryFilter';
import { AuthModal } from './components/AuthModal';
import { Article, Category, NewsResponse } from './types';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';

const categories: Category[] = [
  'AI', 'Apps', 'Security', 'Climate', 'Cloud Computing',
  'Gadgets', 'Gaming', 'Space', 'Government Policy', 'Layoffs',
  'privacy', 'Social', 'Media Entertainment', 'Crypto Currency',
  'Robotics', 'Startups', 'Enterprise', 'Commerce', 'Biotech Health'
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('AI');
  const [visibleArticles, setVisibleArticles] = useState(5);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedArticles();
    }
  }, [user]);

  const fetchSavedArticles = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_articles')
      .select('article_id')
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to fetch saved articles');
      return;
    }

    setSavedArticles(data.map(item => item.article_id));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://tech-pulse-backend.onrender.com/api/techcrunch');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data: NewsResponse = await response.json();
        
        const transformedArticles: Article[] = data.news.map((article, index) => ({
          id: `${article.category}-${index}`,
          title: article.title,
          description: article.description,
          imageUrl: article.image,
          link: article.link,
          category: article.category as Category,
          topics: article.topics,
          author: article.author,
          published: article.published,
          source: article.source
        }));

        setArticles(transformedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSaveArticle = async (article: Article) => {
    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    const isAlreadySaved = savedArticles.includes(article.id);

    try {
      if (isAlreadySaved) {
        await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', article.id);

        setSavedArticles(prev => prev.filter(id => id !== article.id));
        toast.success('Article removed from saved');
      } else {
        await supabase
          .from('saved_articles')
          .insert([
            {
              user_id: user.id,
              article_id: article.id,
              article_data: article
            }
          ]);

        setSavedArticles(prev => [...prev, article.id]);
        toast.success('Article saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save article');
    }
  };

  const filteredArticles = showSaved
    ? articles.filter(article => savedArticles.includes(article.id))
    : articles.filter(article => article.category === selectedCategory);

  const handleLoadMore = () => {
    setVisibleArticles(prev => prev + 5);
  };

  return (
    <div className="min-h-screen relative">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-indigo-400" />
              <h2 className="text-3xl font-bold text-white">TechPulse</h2>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowSaved(!showSaved)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  showSaved
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <BookmarkIcon size={20} />
                Saved Articles
              </button>
              {user ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                    data-login-button
                  >
                    <LogIn size={18} />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-colors"
                    data-signup-button
                  >
                    <UserPlus size={18} />
                    Create Account
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setShowSaved(!showSaved)}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  showSaved
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <BookmarkIcon size={20} />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800/95 backdrop-blur-sm py-4 px-4 shadow-lg">
              <div className="flex flex-col gap-3">
                {user ? (
                  <button
                    onClick={() => {
                      supabase.auth.signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors text-center"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors text-center"
                      data-login-button
                    >
                      <LogIn size={18} />
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('signup');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-colors text-center"
                      data-signup-button
                    >
                      <UserPlus size={18} />
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
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
          <div className="text-center text-red-400 p-8 bg-gray-800/80 backdrop-blur-sm rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.slice(0, visibleArticles).map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSaveClick={() => handleSaveArticle(article)}
                  isSaved={savedArticles.includes(article.id)}
                />
              ))}
            </div>

            {filteredArticles.length > visibleArticles && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Loader2 size={18} />
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-8 mt-auto relative">
        <div className="container mx-auto px-4 text-center">
          <a
            href="https://techcrunch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-400 transition-colors duration-200 text-sm"
          >
            News content provided by techcrunch.com
          </a>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={() => {
          setShowAuthModal(false);
          if (authMode === 'signup') {
            setAuthMode('login');
            setShowAuthModal(true);
          }
        }}
      />
    </div>
  );
}

export default App;