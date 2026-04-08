import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  User, 
  MapPin, 
  Briefcase, 
  Home, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  MessageCircle,
  AlertCircle,
  X,
  FileCheck,
  Clock,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { NavLink, SuratRequest } from '../types';
import { createSuratRequest, trackSuratByNik } from '../services/suratService';
import { uploadImage } from '../services/storageService';
import Footer from './Footer';

interface LetterType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: string[];
}

const LETTER_TYPES: LetterType[] = [
  {
    id: 'domisili',
    title: 'Surat Keterangan Domisili',
    description: 'Untuk keperluan administrasi kependudukan atau pembukaan rekening bank.',
    icon: <MapPin className="w-6 h-6" />,
    fields: ['Alamat Lengkap Saat Ini', 'Keperluan Surat']
  },
  {
    id: 'usaha',
    title: 'Surat Keterangan Usaha',
    description: 'Untuk pengajuan kredit bank atau legalitas usaha mikro/kecil.',
    icon: <Briefcase className="w-6 h-6" />,
    fields: ['Nama Usaha', 'Jenis Usaha', 'Alamat Usaha']
  },
  {
    id: 'kk',
    title: 'Surat Pengantar KK',
    description: 'Untuk pengurusan Kartu Keluarga baru atau perubahan data.',
    icon: <Home className="w-6 h-6" />,
    fields: ['Alasan Perubahan/Pembuatan', 'Jumlah Anggota Keluarga']
  },
  {
    id: 'sktm',
    title: 'Surat Keterangan Tidak Mampu',
    description: 'Untuk keringanan biaya sekolah atau bantuan sosial.',
    icon: <FileText className="w-6 h-6" />,
    fields: ['Keperluan (Sekolah/RS/Lainnya)', 'Nama Instansi Tujuan']
  },
  {
    id: 'pindah',
    title: 'Surat Keterangan Pindah',
    description: 'Untuk pengurusan pindah domisili ke luar wilayah desa.',
    icon: <ArrowRight className="w-6 h-6" />,
    fields: ['Alamat Tujuan Pindah', 'Alasan Pindah']
  }
];

interface ServicePageProps {
  onBack: () => void;
  navLinks: NavLink[];
}

type Step = 'SELECT' | 'IDENTITY' | 'DETAILS' | 'UPLOAD' | 'SUCCESS';

export default function ServicePage({ onBack, navLinks }: ServicePageProps) {
  const [currentStep, setCurrentStep] = useState<Step>('SELECT');
  const [selectedLetter, setSelectedLetter] = useState<LetterType | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);
  const [trackingNik, setTrackingNik] = useState('');
  const [trackingResult, setTrackingResult] = useState<SuratRequest[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSelectLetter = (letter: LetterType) => {
    setSelectedLetter(letter);
    setCurrentStep('IDENTITY');
    setFormError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setFormError('Ukuran file maksimal adalah 2MB');
        return;
      }
      setFile(selectedFile);
      setFormError(null);
    }
  };

  const handleNext = async () => {
    setFormError(null);
    if (currentStep === 'IDENTITY') {
      if (!formData.nik || !formData.nama || !formData.whatsapp) {
        setFormError('Mohon lengkapi semua data identitas (NIK, Nama, dan WhatsApp)');
        return;
      }
      if (formData.nik.length < 16) {
        setFormError('NIK harus berjumlah 16 digit');
        return;
      }
      setCurrentStep('DETAILS');
    } else if (currentStep === 'DETAILS') {
      const allFieldsFilled = selectedLetter?.fields.every(field => formData[field] && formData[field].trim() !== '');
      if (!allFieldsFilled) {
        setFormError('Mohon lengkapi semua detail persyaratan surat');
        return;
      }
      setCurrentStep('UPLOAD');
    } else if (currentStep === 'UPLOAD') {
      if (!file) {
        setFormError('Mohon unggah berkas persyaratan (KTP/KK)');
        return;
      }
      
      try {
        setIsSubmitting(true);
        
        // 1. Upload file (optional, might fail if not authenticated)
        let fileUrl = '';
        try {
          // We try to upload to a 'public-documents' folder if it exists
          // For now using 'surat' folder
          fileUrl = await uploadImage(file, 'surat');
        } catch (uploadErr) {
          console.warn('Upload failed, proceeding without file URL:', uploadErr);
          // If upload fails (likely due to auth), we still proceed with the request
          // but inform the user or just save the metadata
        }

        // 2. Create Request
        await createSuratRequest({
          nik: formData.nik,
          nama_warga: formData.nama,
          wa_number: formData.whatsapp,
          jenis_surat: selectedLetter?.title || '',
          file_url: fileUrl
        });

        setCurrentStep('SUCCESS');
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Gagal mengirim pengajuan');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setFormError(null);
    if (currentStep === 'IDENTITY') setCurrentStep('SELECT');
    else if (currentStep === 'DETAILS') setCurrentStep('IDENTITY');
    else if (currentStep === 'UPLOAD') setCurrentStep('DETAILS');
  };

  const handleTrackStatus = async () => {
    if (!trackingNik) return;
    try {
      setIsTracking(true);
      const data = await trackSuratByNik(trackingNik);
      setTrackingResult(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal melacak surat');
    } finally {
      setIsTracking(false);
    }
  };

  const sendWhatsAppConfirmation = () => {
    const message = `Halo Admin, saya baru saja mengajukan ${selectedLetter?.title} dengan NIK ${formData.nik}. Mohon bantuannya.`;
    window.open(`https://wa.me/628123456789?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {/* Header Section */}
      <header className="bg-emerald-950 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://picsum.photos/seed/service-bg/1920/1080" 
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
            Layanan Surat Mandiri
          </h1>
          <p className="text-emerald-100/70 text-lg max-w-2xl">
            Ajukan permohonan surat keterangan desa secara online dengan mudah, cepat, dan transparan.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentStep === 'SELECT' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-bold text-emerald-950 mb-8">Pilih Jenis Surat</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LETTER_TYPES.map((letter) => (
                      <button
                        key={letter.id}
                        onClick={() => handleSelectLetter(letter)}
                        className="flex items-start gap-5 p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                      >
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {letter.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-emerald-950 mb-2 group-hover:text-emerald-600 transition-colors">
                            {letter.title}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            {letter.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {(currentStep === 'IDENTITY' || currentStep === 'DETAILS' || currentStep === 'UPLOAD') && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-emerald-900/5 border border-stone-100"
                >
                  {/* Progress Bar */}
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                        {currentStep === 'IDENTITY' ? 'Tahap 1: Identitas' : 
                         currentStep === 'DETAILS' ? 'Tahap 2: Detail Surat' : 
                         'Tahap 3: Unggah Berkas'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {currentStep === 'IDENTITY' ? '33%' : 
                         currentStep === 'DETAILS' ? '66%' : 
                         '100%'}
                      </span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ 
                          width: currentStep === 'IDENTITY' ? '33%' : 
                                 currentStep === 'DETAILS' ? '66%' : '100%' 
                        }}
                        className="h-full bg-emerald-600"
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-emerald-950 mb-8">
                    Pengajuan {selectedLetter?.title}
                  </h2>

                  {formError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-bold"
                    >
                      <AlertCircle size={20} />
                      {formError}
                    </motion.div>
                  )}

                  {/* Form Steps */}
                  <div className="space-y-6">
                    {currentStep === 'IDENTITY' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">NIK (Sesuai KTP)</label>
                          <input 
                            type="text" 
                            name="nik"
                            value={formData.nik || ''}
                            onChange={handleInputChange}
                            placeholder="Masukkan 16 digit NIK"
                            className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                          <input 
                            type="text" 
                            name="nama"
                            value={formData.nama || ''}
                            onChange={handleInputChange}
                            placeholder="Sesuai KTP"
                            className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-bold text-slate-700">Nomor WhatsApp</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+62</span>
                            <input 
                              type="tel" 
                              name="whatsapp"
                              value={formData.whatsapp || ''}
                              onChange={handleInputChange}
                              placeholder="8123456789"
                              className="w-full pl-16 pr-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400">Nomor ini akan digunakan untuk mengirimkan notifikasi status surat.</p>
                        </div>
                      </div>
                    )}

                    {currentStep === 'DETAILS' && (
                      <div className="space-y-6">
                        {selectedLetter?.fields.map((field) => (
                          <div key={field} className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">{field}</label>
                            <textarea 
                              name={field}
                              value={formData[field] || ''}
                              onChange={handleInputChange}
                              placeholder={`Masukkan ${field.toLowerCase()}...`}
                              rows={3}
                              className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {currentStep === 'UPLOAD' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Unggah Foto KTP / KK</label>
                          <div className="relative group">
                            <input 
                              type="file" 
                              accept="image/*,.pdf"
                              onChange={handleFileUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`w-full py-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${file ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 bg-stone-50 group-hover:border-emerald-300 group-hover:bg-emerald-50/30'}`}>
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${file ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                {file ? <FileCheck size={32} /> : <Upload size={32} />}
                              </div>
                              <p className="text-sm font-bold text-slate-700 mb-1">
                                {file ? file.name : 'Klik atau seret file ke sini'}
                              </p>
                              <p className="text-xs text-slate-400">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Format: JPG, PNG, PDF (Maks. 2MB)'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 items-start">
                          <AlertCircle className="text-amber-600 shrink-0" size={20} />
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Pastikan foto terlihat jelas, tidak terpotong, dan tidak buram untuk mempercepat proses verifikasi oleh admin desa.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Navigation */}
                  <div className="mt-12 flex items-center justify-between gap-4">
                    <button 
                      onClick={handleBack}
                      className="px-8 py-3 rounded-2xl font-bold text-slate-600 hover:bg-stone-50 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Kembali
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="px-10 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Mengirim...
                        </>
                      ) : (
                        <>
                          {currentStep === 'UPLOAD' ? 'Kirim Pengajuan' : 'Lanjutkan'} <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Privacy Note */}
                  <div className="mt-10 pt-8 border-t border-stone-50 flex items-center gap-3 text-slate-400">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <p className="text-[10px] leading-relaxed">
                      <strong>Peringatan Privasi:</strong> Data Anda dilindungi dan hanya digunakan untuk keperluan administrasi desa sesuai dengan peraturan perlindungan data pribadi yang berlaku.
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 'SUCCESS' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-emerald-900/5 border border-stone-100"
                >
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-emerald-950 mb-4">Pengajuan Berhasil!</h2>
                  <p className="text-slate-600 max-w-md mx-auto mb-10 leading-relaxed">
                    Terima kasih, <strong>{formData.nama}</strong>. Pengajuan <strong>{selectedLetter?.title}</strong> Anda telah kami terima dan sedang dalam antrian verifikasi.
                  </p>
                  
                  <div className="bg-stone-50 rounded-3xl p-6 mb-10 text-left">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ringkasan Pengajuan</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Nomor NIK</span>
                        <span className="font-bold text-emerald-950">{formData.nik}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Jenis Surat</span>
                        <span className="font-bold text-emerald-950">{selectedLetter?.title}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Status Awal</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">DALAM ANTRIAN</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={sendWhatsAppConfirmation}
                      className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={20} /> Konfirmasi via WhatsApp
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentStep('SELECT');
                        setFormData({});
                        setFile(null);
                      }}
                      className="px-8 py-4 bg-stone-100 text-slate-600 rounded-2xl font-bold hover:bg-stone-200 transition-all"
                    >
                      Buat Pengajuan Lain
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Tracking Widget */}
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
              <h3 className="text-lg font-bold text-emerald-950 mb-6 flex items-center gap-2">
                <Search size={20} className="text-emerald-600" />
                Cek Status Surat
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Masukkan NIK Anda untuk memantau proses pengajuan surat yang telah Anda buat.
              </p>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Masukkan NIK"
                  value={trackingNik}
                  onChange={(e) => setTrackingNik(e.target.value)}
                  className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
                <button 
                  onClick={handleTrackStatus}
                  disabled={isTracking}
                  className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTracking && <Loader2 size={18} className="animate-spin" />}
                  Cek Status
                </button>
              </div>

              <AnimatePresence>
                {trackingResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-stone-50 space-y-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Hasil Pelacakan</span>
                      <button onClick={() => setTrackingResult(null)} className="text-slate-300 hover:text-slate-500">
                        <X size={16} />
                      </button>
                    </div>
                    
                    {trackingResult.length > 0 ? (
                      trackingResult.map((req) => (
                        <div key={req.id} className={`p-4 rounded-2xl flex items-center gap-3 border ${
                          req.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          req.status === 'Diproses' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                            {req.status === 'Selesai' ? <CheckCircle2 size={20} /> : 
                             req.status === 'Diproses' ? <RefreshCw size={20} className="animate-spin-slow" /> : 
                             <Clock size={20} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{req.jenis_surat}</p>
                            <p className="text-[10px] font-bold opacity-70">{req.status.toUpperCase()}</p>
                            <p className="text-[8px] opacity-50 mt-1">
                              {new Date(req.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-stone-50 rounded-2xl text-center">
                        <p className="text-xs text-slate-500">Tidak ada pengajuan ditemukan untuk NIK ini.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Help Widget */}
            <div className="bg-emerald-900 rounded-3xl p-8 text-white">
              <h3 className="text-lg font-bold mb-4">Butuh Bantuan?</h3>
              <p className="text-sm text-emerald-100/70 mb-6 leading-relaxed">
                Jika Anda mengalami kesulitan dalam pengisian formulir atau memiliki pertanyaan lain, silakan hubungi layanan bantuan kami.
              </p>
              <a 
                href="https://wa.me/628123456789" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-all"
              >
                <MessageCircle size={20} /> Hubungi Admin
              </a>
            </div>
          </aside>

        </div>
      </main>

      <Footer navLinks={navLinks} />
    </div>
  );
}
