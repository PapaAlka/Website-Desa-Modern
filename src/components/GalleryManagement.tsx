import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Maximize2
} from 'lucide-react';
import GalleryEditor from './GalleryEditor';
import { galleryService } from '../services/galleryService';
import { GalleryItem } from '../types';

export default function GalleryManagement() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAll();
      setGallery(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setView('editor');
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setView('editor');
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await galleryService.delete(id);
      setGallery(gallery.filter(item => item.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus item galeri');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveGallery = async (galleryData: any) => {
    try {
      setIsSaving(true);
      if (editingItem) {
        const updated = await galleryService.update(editingItem.id, galleryData);
        setGallery(gallery.map(item => item.id === editingItem.id ? updated : item));
      } else {
        const created = await galleryService.create(galleryData);
        setGallery([created, ...gallery]);
      }
      setView('list');
      setEditingItem(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan galeri';
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const filteredGallery = gallery.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'Semua' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = ['Semua', ...Array.from(new Set(gallery.map(item => item.category)))];

  if (view === 'editor') {
    return (
      <GalleryEditor 
        onBack={() => setView('list')} 
        onSave={handleSaveGallery}
        isSaving={isSaving}
        initialData={editingItem || undefined}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Manajemen Galeri</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola dokumentasi visual kegiatan dan keindahan desa.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Tambah Foto Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Foto', value: gallery.length, icon: ImageIcon, color: 'emerald' },
          { label: 'Kategori', value: categories.length - 1, icon: Filter, color: 'blue' },
          { label: 'Terbaru', value: gallery.filter(g => {
            const date = new Date(g.created_at);
            const now = new Date();
            return (now.getTime() - date.getTime()) < (7 * 24 * 60 * 60 * 1000);
          }).length, icon: Maximize2, color: 'amber' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari judul foto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl focus:outline-none text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-slate-400" size={18} />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl focus:outline-none text-sm font-bold text-slate-700 transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            <p className="text-slate-500 font-medium">Memuat galeri...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Gagal Memuat Data</h3>
              <p className="text-slate-500 max-w-xs mt-1">{error}</p>
            </div>
            <button 
              onClick={fetchGallery}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <ImageIcon size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tidak Ada Foto</h3>
              <p className="text-slate-500 max-w-xs mt-1">Belum ada foto yang sesuai dengan pencarian atau kategori Anda.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div key={item.id} className="group relative aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-white font-bold text-sm leading-tight mb-4 line-clamp-2">
                    {item.title}
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="w-10 h-10 bg-rose-500/20 hover:bg-rose-500/40 backdrop-blur-md text-rose-200 rounded-xl flex items-center justify-center transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6">
                  <Trash2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Hapus Foto?</h3>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Tindakan ini tidak dapat dibatalkan. Foto akan dihapus secara permanen dari galeri desa.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                  <button 
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => handleDelete(showDeleteConfirm)}
                    disabled={isDeleting}
                    className="px-6 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Ya, Hapus'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
