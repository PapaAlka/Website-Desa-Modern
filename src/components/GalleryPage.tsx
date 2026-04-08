import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ArrowLeft,
  Camera,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import { NavLink, GalleryItem } from '../types';
import { galleryService } from '../services/galleryService';
import Footer from './Footer';

const DUMMY_GALLERY: GalleryItem[] = [
  {
    id: '1',
    title: 'Gotong Royong Bersama',
    category: 'Kegiatan Warga',
    description: 'Warga desa bergotong royong membersihkan saluran irigasi menjelang musim tanam.',
    image_url: 'https://picsum.photos/seed/village-activity-1/1200/800',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Puncak Bukit Sejahtera',
    category: 'Wisata',
    description: 'Pemandangan matahari terbit dari Puncak Bukit Sejahtera yang menjadi destinasi favorit wisatawan.',
    image_url: 'https://picsum.photos/seed/village-tourism-1/1200/800',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Jembatan Gantung Baru',
    category: 'Infrastruktur',
    description: 'Jembatan gantung yang menghubungkan Dusun Krajan dengan Dusun Seberang telah selesai dibangun.',
    image_url: 'https://picsum.photos/seed/village-infra-1/1200/800',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Panen Raya Padi Organik',
    category: 'Kegiatan Warga',
    description: 'Syukuran panen raya padi organik yang melimpah di lahan persawahan kelompok tani Makmur.',
    image_url: 'https://picsum.photos/seed/village-activity-2/1200/800',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Air Terjun Pelangi',
    category: 'Wisata',
    description: 'Keindahan Air Terjun Pelangi yang tersembunyi di dalam hutan lindung desa.',
    image_url: 'https://picsum.photos/seed/village-tourism-2/1200/800',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Kantor Desa Digital',
    category: 'Infrastruktur',
    description: 'Renovasi kantor desa dengan fasilitas pelayanan publik berbasis digital yang modern.',
    image_url: 'https://picsum.photos/seed/village-infra-2/1200/800',
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    title: 'Pasar Tradisional Mingguan',
    category: 'Kegiatan Warga',
    description: 'Suasana ramai pasar tradisional mingguan yang menjadi pusat ekonomi kerakyatan.',
    image_url: 'https://picsum.photos/seed/village-activity-3/1200/800',
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    title: 'Hutan Pinus Asri',
    category: 'Wisata',
    description: 'Area camping ground di tengah hutan pinus yang asri dan sejuk.',
    image_url: 'https://picsum.photos/seed/village-tourism-3/1200/800',
    created_at: new Date().toISOString()
  },
];

const CATEGORIES = ['Semua', 'Kegiatan Warga', 'Wisata', 'Infrastruktur'];

interface GalleryPageProps {
  onBack: () => void;
  navLinks: NavLink[];
}

export default function GalleryPage({ onBack, navLinks }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const data = await galleryService.getAll();
        setGallery(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setGallery([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (activeCategory === 'Semua') {
      setFilteredGallery(gallery);
    } else {
      setFilteredGallery(gallery.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, gallery]);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % filteredGallery.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {/* Header Section */}
      <header className="bg-emerald-950 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://picsum.photos/seed/village-gallery-bg/1920/1080" 
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
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 flex items-center gap-4">
            <Camera className="text-emerald-400" size={40} />
            Galeri Visual Desa
          </h1>
          <p className="text-emerald-100/70 text-lg max-w-2xl">
            Dokumentasi visual keindahan alam, pembangunan infrastruktur, dan ragam kegiatan masyarakat Desa Sejahtera.
          </p>
        </div>
      </header>

      {/* Filter Section */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/5 border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-slate-400">
              <Filter size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Filter Album</span>
            </div>
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
      </section>

      {/* Photo Grid Section */}
      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/2] bg-stone-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[3/2] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-stone-100"
                >
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-emerald-100/60 text-xs">
                      <Maximize2 size={14} />
                      <span>Perbesar Foto</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredGallery.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-6">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-xl font-bold text-emerald-950 mb-2">Foto Tidak Ditemukan</h3>
            <p className="text-slate-500">Maaf, belum ada foto untuk kategori ini.</p>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[110]"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[110]"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full flex flex-col items-center"
            >
              <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={filteredGallery[selectedImageIndex].image_url} 
                  alt={filteredGallery[selectedImageIndex].title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="mt-6 text-center text-white max-w-2xl px-4">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                  {filteredGallery[selectedImageIndex].category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {filteredGallery[selectedImageIndex].title}
                </h2>
                <p className="text-white/60 leading-relaxed">
                  {filteredGallery[selectedImageIndex].description}
                </p>
                <div className="mt-6 text-white/30 text-xs">
                  {selectedImageIndex + 1} dari {filteredGallery.length} Foto
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer navLinks={navLinks} />
    </div>
  );
}
