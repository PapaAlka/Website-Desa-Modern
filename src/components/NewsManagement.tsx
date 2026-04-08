import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Newspaper,
  ChevronRight,
  Loader2
} from 'lucide-react';
import NewsEditor from './NewsEditor';
import { getPosts, createPost, updatePost, deletePost } from '../services/newsService';
import { NewsItem } from '../types';

export default function NewsManagement() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setNews(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingNews(null);
    setView('editor');
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setView('editor');
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deletePost(id);
      setNews(news.filter(item => item.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus berita');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveNews = async (newsData: any) => {
    try {
      setIsSaving(true);
      if (editingNews) {
        const updated = await updatePost(editingNews.id, newsData);
        setNews(news.map(item => item.id === editingNews.id ? updated : item));
      } else {
        const created = await createPost(newsData);
        setNews([created, ...news]);
      }
      setView('list');
      setEditingNews(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan berita';
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'Semua' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  if (view === 'editor') {
    return (
      <NewsEditor 
        onBack={() => setView('list')} 
        onSave={handleSaveNews}
        isSaving={isSaving}
        initialData={editingNews || undefined}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Manajemen Berita</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola semua informasi dan pengumuman desa dalam satu tempat.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Tulis Berita Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Berita', value: news.length, icon: Newspaper, color: 'emerald' },
          { label: 'Sudah Terbit', value: news.filter(n => n.status === 'Terbit').length, icon: CheckCircle2, color: 'blue' },
          { label: 'Draf', value: news.filter(n => n.status === 'Draf').length, icon: Clock, color: 'amber' },
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
            placeholder="Cari judul berita..."
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
            <option value="Semua">Semua Kategori</option>
            <option value="Berita">Berita</option>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Kegiatan">Kegiatan</option>
            <option value="Pembangunan">Pembangunan</option>
          </select>
        </div>
      </div>

      {/* News List Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            <p className="text-slate-500 font-medium">Memuat data berita...</p>
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
              onClick={fetchNews}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <Search size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tidak Ada Berita</h3>
              <p className="text-slate-500 max-w-xs mt-1">Belum ada berita yang sesuai dengan pencarian atau kategori Anda.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Berita</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img 
                            src={item.image_url || 'https://picsum.photos/seed/news/200/150'} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="max-w-xs md:max-w-md">
                          <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Oleh: {item.author_name || 'Admin'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Terbit' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <span className={`text-sm font-bold ${item.status === 'Terbit' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-500 font-medium">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <h3 className="text-2xl font-bold text-slate-900">Hapus Berita?</h3>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Tindakan ini tidak dapat dibatalkan. Berita akan dihapus secara permanen dari database desa.
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
