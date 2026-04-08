import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  ImageIcon,
  Upload,
  Info,
  Loader2,
  Type,
  AlignLeft,
  Tag
} from 'lucide-react';
import { uploadImage } from '../services/storageService';

interface GalleryEditorProps {
  onBack: () => void;
  onSave: (data: any) => Promise<void>;
  isSaving?: boolean;
  initialData?: {
    id?: string;
    title: string;
    category: string;
    image_url: string;
    description?: string;
  };
}

export default function GalleryEditor({ onBack, onSave, isSaving, initialData }: GalleryEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'Kegiatan Warga');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Judul foto wajib diisi!');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Gambar wajib diunggah atau memiliki URL!');
      return;
    }
    setError(null);
    
    try {
      await onSave({ 
        title, 
        category, 
        image_url: imageUrl, 
        description
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan galeri');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const publicUrl = await uploadImage(file, 'gallery');
      setImageUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah gambar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 rounded-2xl transition-all shadow-sm group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {initialData ? `Edit Foto: ${initialData.title}` : 'Tambah Foto Baru'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {initialData ? 'Perbarui informasi foto galeri desa.' : 'Unggah dokumentasi visual terbaru untuk galeri desa.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} />
                Simpan ke Galeri
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 text-sm font-bold"
        >
          <Info size={18} />
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Column */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Type size={14} /> Judul Foto
            </label>
            <input 
              type="text" 
              placeholder="Masukkan judul foto..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm font-bold text-slate-700 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Tag size={14} /> Kategori
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm font-bold text-slate-700 transition-all"
            >
              <option value="Kegiatan Warga">Kegiatan Warga</option>
              <option value="Wisata">Wisata</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Pembangunan">Pembangunan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <AlignLeft size={14} /> Deskripsi (Opsional)
            </label>
            <textarea 
              placeholder="Berikan sedikit konteks tentang foto ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm leading-relaxed text-slate-700 transition-all resize-none"
            ></textarea>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ImageIcon size={14} /> Unggah Gambar
            </label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="URL Gambar..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sedang mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Pilih File (Maks 2MB)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6 sticky top-28">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-6">
              <ImageIcon size={18} />
              Preview Tampilan
            </div>
            
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 relative group">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                  <ImageIcon size={64} />
                  <p className="text-sm font-medium">Belum ada gambar dipilih</p>
                </div>
              )}
              
              {imageUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    {category}
                  </span>
                  <h4 className="text-white font-bold text-xl leading-tight mb-2">
                    {title || 'Judul Foto'}
                  </h4>
                  <p className="text-white/60 text-xs line-clamp-2">
                    {description || 'Deskripsi foto akan muncul di sini...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
