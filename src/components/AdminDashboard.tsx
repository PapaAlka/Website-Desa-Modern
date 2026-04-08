import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Newspaper, 
  FileText, 
  ShoppingBag, 
  Image as ImageIcon, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Plus, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  LogOut,
  ChevronRight,
  Filter
} from 'lucide-react';
import NewsManagement from './NewsManagement';
import GalleryManagement from './GalleryManagement';
import SuratManagement from './SuratManagement';
import { getDashboardStats, DashboardStats } from '../services/statsService';
import { getSuratRequests } from '../services/suratService';
import { SuratRequest } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
}

const MENU_ITEMS = [
  { id: 'ringkasan', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
  { id: 'berita', label: 'Kelola Berita', icon: <Newspaper size={20} /> },
  { id: 'surat', label: 'Permohonan Surat', icon: <FileText size={20} /> },
  { id: 'umkm', label: 'Produk UMKM', icon: <ShoppingBag size={20} /> },
  { id: 'galeri', label: 'Galeri', icon: <ImageIcon size={20} /> },
  { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={20} /> },
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState('ringkasan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<SuratRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [statsData, requestsData] = await Promise.all([
          getDashboardStats(),
          getSuratRequests()
        ]);
        setStats(statsData);
        setRecentRequests(requestsData.slice(0, 5));
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Gagal mengambil statistik.');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeMenu === 'ringkasan') {
      fetchStats();
    }
  }, [activeMenu]);

  const dashboardStats = [
    { label: 'Total Berita', value: stats?.totalPosts || '0', icon: <Newspaper size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Galeri Foto', value: stats?.totalGallery || '0', icon: <ImageIcon size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Surat Masuk', value: stats?.totalSuratRequests || '0', icon: <FileText size={24} />, color: 'text-amber-600', bg: 'bg-amber-50', highlight: (stats?.totalSuratRequests || 0) > 0 },
    { label: 'Produk UMKM', value: stats?.totalPotensi || '0', icon: <ShoppingBag size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Selesai</span>;
      case 'Diproses':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Diproses</span>;
      case 'Pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Pending</span>;
      case 'Ditolak':
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Ditolak</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" 
                  alt="Logo Desa" 
                  className="w-9 h-9 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 leading-none">Admin Desa</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Sejahtera</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 px-4 space-y-1">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  activeMenu === item.id 
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-700'
                }`}
              >
                <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-100">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut size={20} />
              Keluar Sistem
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 hidden md:block">
              {MENU_ITEMS.find(m => m.id === activeMenu)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">M. Shofil</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100">
                <img 
                  src="https://picsum.photos/seed/admin-avatar/100/100" 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {activeMenu === 'ringkasan' && (
              <>
                {/* Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Selamat Datang Kembali!</h2>
                    <p className="text-slate-500 text-sm mt-1">Berikut adalah ringkasan aktivitas desa hari ini.</p>
                  </div>
                  {!isSupabaseConfigured && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800 text-xs font-bold">
                      <AlertCircle size={18} className="text-amber-600" />
                      Konfigurasi Supabase diperlukan untuk melihat data riil.
                    </div>
                  )}
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
                      <AlertCircle size={18} className="text-rose-600" />
                      {error}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                      <ImageIcon size={18} className="text-emerald-600" /> Unggah Foto
                    </button>
                    <button 
                      onClick={() => setActiveMenu('berita')}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10"
                    >
                      <Plus size={18} /> Tambah Berita Baru
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoading ? (
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-40 bg-white rounded-[2rem] animate-pulse border border-slate-100 shadow-sm"></div>
                    ))
                  ) : (
                    dashboardStats.map((stat) => (
                      <motion.div
                        key={stat.label}
                        whileHover={{ y: -4 }}
                        className={`p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all ${
                          stat.highlight ? 'bg-white ring-2 ring-amber-500/20' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            {stat.icon}
                          </div>
                          {stat.highlight && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-bold uppercase tracking-widest rounded-md">Perlu Tindakan</span>
                          )}
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Permohonan Surat Terbaru</h3>
                        <p className="text-xs text-slate-400">Menampilkan 5 pengajuan terakhir dari warga.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition-all">
                        <Filter size={18} />
                      </button>
                      <button className="text-sm font-bold text-emerald-700 hover:underline px-2">
                        Lihat Semua
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {recentRequests.length > 0 ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50">
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Warga</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {recentRequests.map((letter) => (
                            <tr key={letter.id} className="hover:bg-slate-50/30 transition-colors group">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                    {letter.nama_warga.charAt(0)}
                                  </div>
                                  <span className="text-sm font-bold text-slate-700">{letter.nama_warga}</span>
                                </div>
                              </td>
                              <td className="px-8 py-5 text-sm text-slate-600">{letter.jenis_surat}</td>
                              <td className="px-8 py-5 text-sm text-slate-500">
                                {new Date(letter.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </td>
                              <td className="px-8 py-5">
                                {getStatusBadge(letter.status)}
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button 
                                  onClick={() => setActiveMenu('surat')}
                                  className="p-2 text-slate-300 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                                >
                                  <ChevronRight size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 size={40} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Semua pekerjaan beres!</h4>
                        <p className="text-slate-500 max-w-xs">Tidak ada surat yang menunggu untuk diproses saat ini.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold text-slate-900">Grafik Pengunjung (Dummy)</h3>
                      <select className="text-xs font-bold text-slate-500 bg-slate-50 border-none rounded-lg focus:ring-0">
                        <option>7 Hari Terakhir</option>
                        <option>30 Hari Terakhir</option>
                      </select>
                    </div>
                    <div className="h-48 flex items-end justify-between gap-2">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            className="w-full bg-emerald-100 rounded-t-lg relative group"
                          >
                            <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                          </motion.div>
                          <span className="text-[10px] font-bold text-slate-400">H-{6-i}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <h3 className="text-lg font-bold mb-6">Tips Admin</h3>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                          <AlertCircle size={20} className="text-emerald-400" />
                        </div>
                        <p className="text-xs text-emerald-100/70 leading-relaxed">
                          Jangan lupa untuk memverifikasi NIK warga sebelum memproses permohonan surat.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                          <TrendingUp size={20} className="text-emerald-400" />
                        </div>
                        <p className="text-xs text-emerald-100/70 leading-relaxed">
                          Update berita desa secara rutin dapat meningkatkan kepercayaan warga terhadap transparansi desa.
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-8 py-3 bg-white text-emerald-900 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all">
                      Pelajari Selengkapnya
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeMenu === 'berita' && <NewsManagement />}
            {activeMenu === 'galeri' && <GalleryManagement />}
            {activeMenu === 'surat' && <SuratManagement />}

            {activeMenu !== 'ringkasan' && activeMenu !== 'berita' && activeMenu !== 'galeri' && activeMenu !== 'surat' && (
              <div className="py-24 flex flex-col items-center justify-center text-center px-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6">
                  <Settings size={48} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Halaman Sedang Dikembangkan</h4>
                <p className="text-slate-500 max-w-xs">Fitur untuk menu {MENU_ITEMS.find(m => m.id === activeMenu)?.label} akan segera hadir.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
