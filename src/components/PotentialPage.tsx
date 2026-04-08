import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  MapPin, 
  Leaf, 
  ArrowLeft, 
  MessageCircle, 
  Info,
  TrendingUp,
  Droplets,
  Sun,
  Wind,
  Loader2,
  PackageSearch
} from 'lucide-react';
import { NavLink, PotensiItem } from '../types';
import { getPotensiDesa } from '../services/potensiService';
import Footer from './Footer';

const DUMMY_POTENTIAL: PotensiItem[] = [
  // UMKM
  {
    id: '1',
    nama_item: 'Kerajinan Anyaman Bambu',
    tipe: 'UMKM',
    deskripsi: 'Produk anyaman bambu berkualitas tinggi hasil karya pengrajin lokal Dusun Krajan.',
    image_url: 'https://picsum.photos/seed/bamboo-craft/800/800',
    harga: 25000,
    wa_penjual: '628123456789',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    nama_item: 'Kopi Robusta Sejahtera',
    tipe: 'UMKM',
    deskripsi: 'Biji kopi pilihan yang diproses secara tradisional dengan aroma dan cita rasa yang khas.',
    image_url: 'https://picsum.photos/seed/coffee-village/800/800',
    harga: 45000,
    wa_penjual: '628123456789',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    nama_item: 'Madu Hutan Murni',
    tipe: 'UMKM',
    deskripsi: 'Madu asli dari hutan lindung desa yang dipanen secara berkelanjutan oleh warga.',
    image_url: 'https://picsum.photos/seed/honey-village/800/800',
    harga: 85000,
    wa_penjual: '628123456789',
    created_at: new Date().toISOString()
  },
  // Pertanian & Alam
  {
    id: '4',
    nama_item: 'Padi Organik Varietas Unggul',
    tipe: 'Pertanian',
    deskripsi: 'Komoditas utama desa yang ditanam tanpa pestisida kimia di lahan subur lereng bukit.',
    image_url: 'https://picsum.photos/seed/rice-field/800/800',
    harga: 0,
    wa_penjual: '',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    nama_item: 'Perkebunan Cengkeh Tua',
    tipe: 'Pertanian',
    deskripsi: 'Warisan leluhur berupa ribuan pohon cengkeh yang menjadi penopang ekonomi warga.',
    image_url: 'https://picsum.photos/seed/clove-tree/800/800',
    harga: 0,
    wa_penjual: '',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    nama_item: 'Budidaya Ikan Nila Kolam Air Deras',
    tipe: 'Pertanian',
    deskripsi: 'Pemanfaatan mata air pegunungan untuk budidaya ikan nila berkualitas tinggi.',
    image_url: 'https://picsum.photos/seed/fish-pond/800/800',
    harga: 0,
    wa_penjual: '',
    created_at: new Date().toISOString()
  },
  // Wisata Desa
  {
    id: '7',
    nama_item: 'Air Terjun Curug Indah',
    tipe: 'Wisata',
    deskripsi: 'Keindahan air terjun setinggi 20 meter dengan kolam alami yang jernih dan sejuk.',
    image_url: 'https://picsum.photos/seed/waterfall-village/800/800',
    harga: 0,
    wa_penjual: '628123456789',
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    nama_item: 'Camping Ground Bukit Bintang',
    tipe: 'Wisata',
    deskripsi: 'Area berkemah dengan pemandangan lampu kota di malam hari dan sunrise yang memukau.',
    image_url: 'https://picsum.photos/seed/camping-village/800/800',
    harga: 0,
    wa_penjual: '628123456789',
    created_at: new Date().toISOString()
  },
  {
    id: '9',
    nama_item: 'Wisata Edukasi Tani',
    tipe: 'Wisata',
    deskripsi: 'Belajar bercocok tanam dan memanen hasil bumi langsung dari sawah bersama petani.',
    image_url: 'https://picsum.photos/seed/edu-farm/800/800',
    harga: 0,
    wa_penjual: '628123456789',
    created_at: new Date().toISOString()
  }
];

const TABS = [
  { id: 'UMKM', label: 'Produk Unggulan (UMKM)', icon: <ShoppingBag size={18} /> },
  { id: 'Pertanian', label: 'Pertanian & Alam', icon: <Leaf size={18} /> },
  { id: 'Wisata', label: 'Wisata Desa', icon: <MapPin size={18} /> }
];

interface PotentialPageProps {
  onBack: () => void;
  navLinks: NavLink[];
}

export default function PotentialPage({ onBack, navLinks }: PotentialPageProps) {
  const [activeTab, setActiveTab] = useState<'UMKM' | 'Pertanian' | 'Wisata'>('UMKM');
  const [potensi, setPotensi] = useState<PotensiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPotensi = async () => {
      try {
        setIsLoading(true);
        const data = await getPotensiDesa();
        setPotensi(data.length > 0 ? data : DUMMY_POTENTIAL);
      } catch (error) {
        console.error('Error fetching potensi:', error);
        setPotensi(DUMMY_POTENTIAL);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPotensi();
  }, []);

  const filteredItems = potensi.filter(item => item.tipe === activeTab);

  const handleContact = (whatsapp: string, name: string) => {
    const message = `Halo, saya tertarik dengan ${name} yang ada di website Desa Sejahtera. Bisa minta informasi lebih lanjut?`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/village-panorama/1920/1080" 
            alt="Panorama Desa" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onBack}
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-8 group bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Potensi Desa Sejahtera
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-100/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Menjelajahi kekayaan alam yang melimpah, kreativitas tanpa batas warga desa, 
            dan destinasi wisata yang memanjakan mata.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-24">
        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-stone-100 mb-12 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                  : 'text-slate-500 hover:bg-stone-50 hover:text-emerald-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-stone-100"></div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img 
                        src={item.image_url} 
                        alt={item.nama_item} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-emerald-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                          {item.tipe === 'UMKM' ? 'Produk Lokal' : 
                          item.tipe === 'Pertanian' ? 'Hasil Bumi' : 'Destinasi'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-emerald-950 mb-3 group-hover:text-emerald-700 transition-colors">
                        {item.nama_item}
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">
                        {item.deskripsi}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                        <div>
                          {item.harga > 0 && (
                            <div className="text-emerald-700 font-bold text-sm">
                              Rp {item.harga.toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                        
                        {item.wa_penjual && (
                          <button 
                            onClick={() => handleContact(item.wa_penjual, item.nama_item)}
                            className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Hubungi via WhatsApp"
                          >
                            <MessageCircle size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center">
                  <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-6">
                    <PackageSearch size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950 mb-2">Belum Ada Data</h3>
                  <p className="text-slate-500">Belum ada potensi desa untuk kategori {activeTab}.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Geographic Info Section */}
        <section className="mt-24">
          <div className="bg-emerald-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
                  <Info size={14} />
                  Geografis & Komoditas
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Kesuburan Tanah yang Menjadi Berkah Bagi Warga
                </h2>
                <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
                  Terletak di ketinggian 600-800 MDPL, Desa Sejahtera memiliki iklim mikro yang sangat mendukung 
                  pertanian hortikultura dan perkebunan rakyat. Curah hujan yang stabil dan tanah vulkanik 
                  menjadikan setiap jengkal tanah kami sangat produktif.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-bold">85%</div>
                      <div className="text-xs text-emerald-100/50">Lahan Produktif</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-bold">12+</div>
                      <div className="text-xs text-emerald-100/50">Mata Air Alami</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Padi Organik', icon: <Leaf />, color: 'bg-amber-500' },
                  { label: 'Cengkeh', icon: <Wind />, color: 'bg-emerald-500' },
                  { label: 'Sayuran Segar', icon: <Sun />, color: 'bg-orange-500' },
                  { label: 'Perikanan', icon: <Droplets />, color: 'bg-blue-500' }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors group"
                  >
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="font-bold text-sm">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer navLinks={navLinks} />
    </div>
  );
}
