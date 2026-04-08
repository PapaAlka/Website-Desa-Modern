/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  FileText, 
  Eye, 
  Newspaper, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProfilePage from './components/ProfilePage';
import NewsArchive from './components/NewsArchive';
import NewsDetail from './components/NewsDetail';
import GalleryPage from './components/GalleryPage';
import ServicePage from './components/ServicePage';
import PotentialPage from './components/PotentialPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { NavLink, NewsItem, GalleryItem, PotensiItem } from './types';
import { getPosts } from './services/newsService';
import { getPotensiDesa } from './services/potensiService';
import { galleryService } from './services/galleryService';
import { isSupabaseConfigured, supabase } from './lib/supabase';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'newsArchive' | 'newsDetail' | 'gallery' | 'service' | 'potential' | 'login' | 'dashboard'>('home');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [potensi, setPotensi] = useState<PotensiItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Test connection
        const { data: testData, error: testError } = await supabase.from('posts').select('id').limit(1);
        if (testError) {
          console.error('Supabase Connection Test Failed:', testError.message);
          setError(`Koneksi Supabase Gagal: ${testError.message}`);
        } else {
          console.log('Supabase Connected Successfully!');
        }

        const [postsData, potensiData, galleryData] = await Promise.all([
          getPosts(true), // Only published posts for home page
          getPotensiDesa(),
          galleryService.getAll()
        ]);
        
        setNews(postsData);
        setPotensi(potensiData);
        setGallery(galleryData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Beranda', href: '#', action: () => setCurrentPage('home') },
    { name: 'Berita', href: '#berita', action: () => setCurrentPage('newsArchive') },
    { name: 'Layanan', href: '#layanan', action: () => setCurrentPage('service') },
    { name: 'Galeri', href: '#galeri', action: () => setCurrentPage('gallery') },
    { name: 'Profil', href: '#profil', action: () => setCurrentPage('profile') },
    { name: 'Potensi', href: '#potensi', action: () => setCurrentPage('potential') },
  ];

  const popularNews: NewsItem[] = news.slice(0, 3);

  if (currentPage === 'profile') {
    return <ProfilePage 
      navLinks={navLinks}
      onBack={() => {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }} 
    />;
  }

  if (currentPage === 'newsArchive') {
    return <NewsArchive 
      navLinks={navLinks}
      onSelectNews={(news) => {
        setSelectedNews(news);
        setCurrentPage('newsDetail');
        window.scrollTo(0, 0);
      }}
      onBack={() => {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }} 
    />;
  }

  if (currentPage === 'newsDetail' && selectedNews) {
    return <NewsDetail 
      news={selectedNews}
      popularNews={popularNews}
      navLinks={navLinks}
      onBack={() => {
        setCurrentPage('newsArchive');
        window.scrollTo(0, 0);
      }} 
    />;
  }

  if (currentPage === 'gallery') {
    return <GalleryPage 
      navLinks={navLinks}
      onBack={() => {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }} 
    />;
  }

  if (currentPage === 'service') {
    return <ServicePage 
      navLinks={navLinks}
      onBack={() => {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }} 
    />;
  }

  if (currentPage === 'potential') {
    return <PotentialPage 
      navLinks={navLinks}
      onBack={() => {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }} 
    />;
  }

  if (currentPage === 'login') {
    return <LoginPage 
      onBack={() => {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }}
      onLoginSuccess={() => {
        setCurrentPage('dashboard');
        window.scrollTo(0, 0);
      }}
    />;
  }

  if (currentPage === 'dashboard') {
    return <AdminDashboard 
      onLogout={() => {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }}
    />;
  }
  const services = [
    {
      title: 'Administrasi',
      description: 'Layanan kependudukan, surat menyurat, dan perizinan desa secara online.',
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      action: () => setCurrentPage('service'),
    },
    {
      title: 'Transparansi',
      description: 'Akses terbuka informasi anggaran, program kerja, dan laporan desa.',
      icon: <Eye className="w-6 h-6 text-emerald-600" />,
      action: () => setCurrentPage('home'),
    },
    {
      title: 'Berita Desa',
      description: 'Informasi terkini seputar kegiatan, pengumuman, dan agenda desa.',
      icon: <Newspaper className="w-6 h-6 text-emerald-600" />,
      action: () => setCurrentPage('newsArchive'),
    },
  ];

  // Removed static news array as it's now fetched from Supabase
  const latestNews = news.slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {!isSupabaseConfigured && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white text-center py-2 text-xs font-bold shadow-lg">
          Konfigurasi Supabase Belum Lengkap. Silakan atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Settings.
        </div>
      )}
      {error && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-emerald-100 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" 
                  alt="Logo Desa" 
                  className="w-9 h-9 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-emerald-950 leading-none">Desa Sejahtera</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Website Resmi</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => {
                    if (link.action) {
                      e.preventDefault();
                      link.action();
                    }
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => setCurrentPage('login')}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:text-emerald-700 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-stone-100 shadow-xl md:hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (link.action) {
                        e.preventDefault();
                        link.action();
                      }
                    }}
                    className="text-lg font-medium text-slate-600 hover:text-emerald-700 px-2"
                  >
                    {link.name}
                  </a>
                ))}
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentPage('login');
                  }}
                  className="bg-emerald-600 text-white w-full py-3 rounded-xl font-bold mt-2"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-emerald-50/30">
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://picsum.photos/seed/village-nature/1920/1080?blur=10" 
            alt="Village Background" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-transparent to-stone-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-emerald-200">
                Selamat Datang di Website Resmi
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-emerald-950 mb-6 leading-[1.1] tracking-tight">
                Membangun Desa <br />
                <span className="text-emerald-600">Mandiri & Digital</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                Wujudkan pelayanan publik yang cepat, transparan, dan akuntabel untuk seluruh warga Desa Sejahtera melalui integrasi teknologi informasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2">
                  Jelajahi Desa
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white text-emerald-900 border border-emerald-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-sm flex items-center justify-center">
                  Lihat Profil
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white">
                <img 
                  src="https://picsum.photos/seed/village-view/800/1000" 
                  alt="Village View" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-200/40 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-24 h-24 border-2 border-emerald-200/50 rounded-2xl rotate-12 -z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="layanan" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">Layanan Utama</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pelayanan terbaik untuk kenyamanan dan kemudahan seluruh warga desa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-emerald-950 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
                <button 
                  onClick={service.action}
                  className="mt-6 text-emerald-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Selengkapnya <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <section id="berita" className="py-24 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">Berita Terbaru</h2>
              <p className="text-slate-600">
                Ikuti perkembangan terkini dan kegiatan yang ada di desa kami.
              </p>
            </div>
            <button 
              onClick={() => {
                setCurrentPage('newsArchive');
                window.scrollTo(0, 0);
              }}
              className="text-emerald-700 font-bold flex items-center gap-2 hover:underline decoration-2 underline-offset-4"
            >
              Lihat Semua Berita <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-stone-100"></div>
              ))
            ) : latestNews.length > 0 ? (
              latestNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedNews(item);
                    setCurrentPage('newsDetail');
                    window.scrollTo(0, 0);
                  }}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.image_url || 'https://picsum.photos/seed/news/800/450'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-emerald-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <time className="text-xs font-medium text-slate-400 mb-3 block">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </time>
                    <h3 className="text-xl font-bold text-emerald-950 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div 
                      className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6"
                      dangerouslySetInnerHTML={{ __html: item.content || '' }}
                    />
                    <div className="pt-4 border-t border-stone-50">
                      <button className="text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                        Baca Selengkapnya <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-400 italic">
                Belum ada berita terbaru.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeri" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">Galeri Desa</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Keindahan alam dan momen kebersamaan warga di Desa Sejahtera.
              </p>
            </div>
            <button 
              onClick={() => {
                setCurrentPage('gallery');
                window.scrollTo(0, 0);
              }}
              className="text-emerald-700 font-bold flex items-center gap-2 hover:underline decoration-2 underline-offset-4"
            >
              Lihat Semua Galeri <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-white/10 rounded-2xl animate-pulse"></div>
              ))
            ) : gallery.length > 0 ? (
              gallery.slice(0, 8).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setCurrentPage('gallery');
                    window.scrollTo(0, 0);
                  }}
                  className="aspect-square rounded-2xl overflow-hidden group relative cursor-pointer"
                >
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                    <span className="text-white font-medium text-sm">{item.title}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 py-20 text-center bg-white/5 rounded-3xl border border-white/10">
                <p className="text-slate-400 italic">Belum ada foto galeri.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Potential Preview Section */}
      <section id="potensi" className="py-24 bg-emerald-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Potensi Alam & Kreativitas Warga Desa
              </h2>
              <p className="text-emerald-100/70 text-lg mb-8 leading-relaxed">
                Desa Sejahtera menyimpan sejuta potensi, mulai dari hasil bumi yang melimpah, 
                produk UMKM yang kreatif, hingga destinasi wisata alam yang memukau. 
                Kami terus berinovasi untuk memajukan ekonomi desa melalui pemberdayaan masyarakat.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    setCurrentPage('potential');
                    window.scrollTo(0, 0);
                  }}
                  className="px-8 py-4 bg-white text-emerald-950 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2"
                >
                  Jelajahi Potensi <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {potensi.length > 0 ? (
                <>
                  <div className="space-y-4 pt-12">
                    {potensi[0] && (
                      <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl relative group">
                        <img src={potensi[0].image_url} alt={potensi[0].title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-bold">{potensi[0].title}</span>
                        </div>
                      </div>
                    )}
                    {potensi[1] && (
                      <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl relative group">
                        <img src={potensi[1].image_url} alt={potensi[1].title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-bold">{potensi[1].title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {potensi[2] && (
                      <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl relative group">
                        <img src={potensi[2].image_url} alt={potensi[2].title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-bold">{potensi[2].title}</span>
                        </div>
                      </div>
                    )}
                    {potensi[3] && (
                      <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl relative group">
                        <img src={potensi[3].image_url} alt={potensi[3].title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-bold">{potensi[3].title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4 pt-12">
                    <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
                      <img src="https://picsum.photos/seed/pot-1/600/800" alt="Potensi 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl">
                      <img src="https://picsum.photos/seed/pot-2/600/600" alt="Potensi 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl">
                      <img src="https://picsum.photos/seed/pot-3/600/600" alt="Potensi 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
                      <img src="https://picsum.photos/seed/pot-4/600/800" alt="Potensi 4" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer navLinks={navLinks} />
    </div>
  );
}
