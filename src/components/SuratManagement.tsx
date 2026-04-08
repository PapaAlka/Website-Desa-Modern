import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  MessageCircle, 
  FileText,
  MoreVertical,
  ChevronRight,
  Loader2,
  RefreshCw,
  Mail,
  XCircle
} from 'lucide-react';
import { SuratRequest } from '../types';
import { getSuratRequests, updateSuratStatus, deleteSuratRequest } from '../services/suratService';

export default function SuratManagement() {
  const [requests, setRequests] = useState<SuratRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getSuratRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data permohonan surat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'Pending' | 'Diproses' | 'Selesai' | 'Ditolak') => {
    try {
      setIsUpdating(id);
      const updated = await updateSuratStatus(id, newStatus);
      setRequests(requests.map(req => req.id === id ? updated : req));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memperbarui status');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSuratRequest(id);
      setRequests(requests.filter(req => req.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus permohonan');
    }
  };

  const handleWhatsApp = (req: SuratRequest) => {
    const message = `Halo Bapak/Ibu ${req.nama_warga}, permohonan surat ${req.jenis_surat} Anda saat ini berstatus: ${req.status}.`;
    window.open(`https://wa.me/${req.wa_number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.nama_warga.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.nik.includes(searchTerm) ||
      req.jenis_surat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'Semua' || req.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Diproses': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Selesai': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Ditolak': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={14} />;
      case 'Diproses': return <RefreshCw size={14} className="animate-spin-slow" />;
      case 'Selesai': return <CheckCircle2 size={14} />;
      case 'Ditolak': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Permohonan Surat</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola permohonan surat administrasi dari warga desa.</p>
        </div>
        <button 
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending', count: requests.filter(r => r.status === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Diproses', count: requests.filter(r => r.status === 'Diproses').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Selesai', count: requests.filter(r => r.status === 'Selesai').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ditolak', count: requests.filter(r => r.status === 'Ditolak').length, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} p-6 rounded-3xl border border-white shadow-sm`}>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama, NIK, atau Jenis Surat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="text-slate-400 shrink-0" size={18} />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 md:w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm font-bold text-slate-700 transition-all"
          >
            <option value="Semua">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Request List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Warga / NIK</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6">
                      <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{req.nama_warga}</div>
                      <div className="text-xs text-slate-400 mt-0.5">NIK: {req.nik}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <FileText size={16} className="text-emerald-600" />
                        {req.jenis_surat}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-slate-500">
                        {new Date(req.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(req.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleWhatsApp(req)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Hubungi Warga"
                        >
                          <MessageCircle size={18} />
                        </button>
                        
                        <div className="relative group/menu">
                          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical size={18} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-1">
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Pending')}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-lg flex items-center gap-2"
                            >
                              <Clock size={14} /> Set Pending
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Diproses')}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                            >
                              <RefreshCw size={14} /> Set Diproses
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Selesai')}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2"
                            >
                              <CheckCircle2 size={14} /> Set Selesai
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Ditolak')}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                            >
                              <XCircle size={14} /> Set Ditolak
                            </button>
                            <div className="h-px bg-slate-50 my-1"></div>
                            <button 
                              onClick={() => setShowDeleteConfirm(req.id)}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                            >
                              <Trash2 size={14} /> Hapus Data
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <Mail size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Tidak Ada Permohonan</h3>
                    <p className="text-slate-500 text-sm">Belum ada warga yang mengajukan permohonan surat.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Hapus Permohonan?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Data permohonan akan dihapus permanen dari sistem.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-6 py-3.5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/10"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
