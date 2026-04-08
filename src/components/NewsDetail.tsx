import { motion } from 'motion/react';
import { 
  Calendar, 
  User, 
  ChevronRight, 
  Facebook, 
  Twitter, 
  Link as LinkIcon, 
  ArrowLeft,
  Clock,
  Share2,
  MessageCircle
} from 'lucide-react';
import { NavLink, NewsItem } from '../types';
import Footer from './Footer';

interface NewsDetailProps {
  news: NewsItem;
  onBack: () => void;
  navLinks: NavLink[];
  popularNews: NewsItem[];
}

export default function NewsDetail({ news, onBack, navLinks, popularNews }: NewsDetailProps) {
  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + ' ' + window.location.href)}`);
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link berhasil disalin!');
  };

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "image": [news.image_url || 'https://picsum.photos/seed/news/800/450'],
    "datePublished": news.created_at,
    "author": [{
      "@type": "Person",
      "name": news.author_name || 'Admin Desa',
      "url": "#"
    }]
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Header / Breadcrumbs */}
      <div className="bg-white border-b border-stone-100 pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <button onClick={onBack} className="hover:text-emerald-600 transition-colors">Beranda</button>
            <ChevronRight size={12} />
            <button onClick={onBack} className="hover:text-emerald-600 transition-colors">Berita</button>
            <ChevronRight size={12} />
            <span className="text-slate-600 truncate">{news.title}</span>
          </nav>

          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">
              {news.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-emerald-950 leading-tight mb-6 tracking-tight">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <User size={16} />
                </div>
                <span className="font-semibold text-slate-700">{news.author_name || 'Admin Desa'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-emerald-600" />
                <span>{news.created_at ? new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-600" />
                <span>5 Menit Baca</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm">
              {/* Hero Image */}
              <div className="aspect-video relative">
                <img 
                  src={news.image_url || 'https://picsum.photos/seed/news/800/450'} 
                  alt={news.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-6 py-4 bg-stone-50/50 border-b border-stone-100 text-xs text-slate-500 italic">
                Foto: Dokumentasi Pemerintah Desa - {news.title}
              </div>

              {/* Article Body */}
              <div className="p-8 md:p-12">
                <div 
                  className="prose prose-emerald prose-lg max-w-none text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.content || '' }}
                />

                {/* Social Share */}
                <div className="mt-16 pt-8 border-t border-stone-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Bagikan:</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={shareToWhatsApp}
                          className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <MessageCircle size={20} />
                        </button>
                        <button 
                          onClick={shareToFacebook}
                          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Facebook size={20} />
                        </button>
                        <button 
                          onClick={copyLink}
                          className="w-10 h-10 rounded-full bg-stone-100 text-slate-600 flex items-center justify-center hover:bg-slate-600 hover:text-white transition-all"
                        >
                          <LinkIcon size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {['DesaDigital', 'BeritaDesa', 'Pembangunan'].map(tag => (
                        <span key={tag} className="text-xs font-medium text-slate-400 bg-stone-50 px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button onClick={onBack} className="flex items-center gap-2 text-emerald-700 font-bold hover:gap-3 transition-all">
                <ArrowLeft size={20} /> Berita Sebelumnya
              </button>
              <button onClick={onBack} className="flex items-center gap-2 text-emerald-700 font-bold hover:gap-3 transition-all text-right">
                Berita Selanjutnya <ChevronRight size={20} />
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Popular News Widget */}
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-emerald-950 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600" />
                Berita Populer
              </h3>
              <div className="space-y-6">
                {popularNews.map((item, i) => (
                  <div key={item.id} className="group flex gap-4 cursor-pointer" onClick={() => onBack()}>
                    <div className="text-2xl font-black text-stone-100 group-hover:text-emerald-100 transition-colors">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-stone-50">
                <h3 className="text-lg font-bold text-emerald-950 mb-6">Kategori</h3>
                <div className="flex flex-wrap gap-2">
                  {['Berita', 'Pengumuman', 'Kegiatan', 'Pembangunan'].map(cat => (
                    <button key={cat} className="px-4 py-2 bg-stone-50 text-slate-600 text-xs font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Widget */}
              <div className="mt-10 bg-emerald-600 rounded-2xl p-6 text-white">
                <h4 className="font-bold mb-2">Langganan Berita</h4>
                <p className="text-xs text-emerald-100 mb-4">Dapatkan informasi terbaru langsung di email Anda.</p>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Email Anda" 
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button className="w-full py-2 bg-white text-emerald-600 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors">
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer navLinks={navLinks} />
    </div>
  );
}

function TrendingUp({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
