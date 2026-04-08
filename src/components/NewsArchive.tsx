import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Inbox,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { NavLink, NewsItem } from '../types';
import { getPosts } from '../services/newsService';
import Footer from './Footer';

const CATEGORIES = ['Semua', 'Berita', 'Pengumuman', 'Kegiatan', 'Pembangunan'];

interface NewsArchiveProps {
  onBack: () => void;
  navLinks: NavLink[];
  onSelectNews: (news: NewsItem) => void;
}

export default function NewsArchive({ onBack, navLinks, onSelectNews }: NewsArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const data = await getPosts(true); // Only published posts
      setNews(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat berita');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {/* Header Section */}
      <header className="bg-emerald-950 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://picsum.photos/seed/village-pattern/1920/1080" 
            alt="Pattern" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Kabar & Berita Desa
          </h1>
          <p className="text-emerald-100/70 text-lg max-w-2xl">
            Informasi terkini mengenai pembangunan, kegiatan, dan pengumuman resmi dari Pemerintah Desa Sejahtera.
          </p>
        </div>
      </header>

      {/* Filter & Search Section */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/5 border border-stone-100">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      activeCategory === cat 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                        : 'bg-stone-50 text-slate-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid Section */}
      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-100 p-4">
                  <div className="aspect-video bg-stone-200 animate-pulse rounded-2xl mb-4"></div>
                  <div className="h-4 w-24 bg-stone-200 animate-pulse rounded-full mb-4"></div>
                  <div className="h-6 w-full bg-stone-200 animate-pulse rounded-full mb-2"></div>
                  <div className="h-6 w-2/3 bg-stone-200 animate-pulse rounded-full mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-stone-100 animate-pulse rounded-full"></div>
                    <div className="h-3 w-full bg-stone-100 animate-pulse rounded-full"></div>
                    <div className="h-3 w-1/2 bg-stone-100 animate-pulse rounded-full"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                <Inbox size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Gagal Memuat Berita</h3>
                <p className="text-slate-500 max-w-xs mt-1">{error}</p>
              </div>
              <button 
                onClick={fetchNews}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredNews.length > 0 ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {filteredNews.map((newsItem, index) => (
                <motion.article
                  key={newsItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectNews(newsItem)}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={newsItem.image_url || 'https://picsum.photos/seed/news/800/450'} 
                      alt={newsItem.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {newsItem.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-emerald-950 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {newsItem.title}
                    </h2>
                    <div 
                      className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6"
                      dangerouslySetInnerHTML={{ __html: newsItem.content || '' }}
                    />
                    <div className="pt-4 border-t border-stone-50 flex items-center justify-between text-[11px] font-medium text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {newsItem.created_at ? new Date(newsItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} />
                        {newsItem.author_name || 'Admin'}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <Inbox size={40} />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 mb-2">Berita Tidak Ditemukan</h3>
              <p className="text-slate-500 max-w-xs">
                Maaf, berita yang Anda cari tidak ditemukan. Coba kata kunci lain atau pilih kategori yang berbeda.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Semua');
                }}
                className="mt-6 text-emerald-600 font-bold hover:underline"
              >
                Reset Pencarian
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer navLinks={navLinks} />
    </div>
  );
}
