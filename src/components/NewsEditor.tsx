import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Bold, 
  Italic, 
  Quote, 
  List as ListIcon, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Upload,
  Type,
  Eye,
  Code,
  Info,
  Loader2
} from 'lucide-react';
import { uploadImage } from '../services/storageService';
import { generateSlug } from '../services/newsService';

interface NewsEditorProps {
  onBack: () => void;
  onSave: (data: any) => Promise<void>;
  isSaving?: boolean;
  initialData?: {
    id?: string;
    title: string;
    category: string;
    image_url: string;
    content: string;
    slug: string;
    status: string;
    author_name: string;
  };
}

export default function NewsEditor({ onBack, onSave, isSaving, initialData }: NewsEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'Berita');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [authorName, setAuthorName] = useState(initialData?.author_name || 'Admin Desa');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertTag = (openTag: string, closeTag: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newText = `${before}${openTag}${selectedText}${closeTag}${after}`;
    setContent(newText);
    
    // Focus back and set cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + openTag.length + selectedText.length + closeTag.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleSave = async (status: 'Draf' | 'Terbit') => {
    if (!title.trim()) {
      setError('Judul berita wajib diisi!');
      window.scrollTo(0, 0);
      return;
    }
    setError(null);
    
    try {
      await onSave({ 
        title, 
        slug: initialData?.slug || generateSlug(title),
        category, 
        image_url: imageUrl, 
        content, 
        status,
        author_name: authorName
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan berita');
      window.scrollTo(0, 0);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const publicUrl = await uploadImage(file, 'news');
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
              {initialData ? `Edit Berita: ${initialData.title}` : 'Tulis Berita Baru'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {initialData ? 'Perbarui informasi yang sudah ada untuk warga desa.' : 'Buat dan publikasikan informasi terbaru untuk warga desa.'}
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
            onClick={() => handleSave('Draf')}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            Simpan Draf
          </button>
          <button 
            onClick={() => handleSave('Terbit')}
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
                <Send size={20} />
                Publikasikan Sekarang
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

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Editor Column */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Judul Berita</label>
              <input 
                type="text" 
                placeholder="Masukkan judul berita yang menarik..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 focus:outline-none text-2xl font-bold text-slate-900 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm font-bold text-slate-700 transition-all"
                >
                  <option value="Berita">Berita</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Pembangunan">Pembangunan</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Gambar Berita</label>
                <div className="flex flex-col gap-3">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="URL Gambar atau Upload..."
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
                          Upload Gambar (Maks 2MB)
                        </>
                      )}
                    </button>
                    {imageUrl && (
                      <button 
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-4 py-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Penulis</label>
              <input 
                type="text" 
                placeholder="Admin Desa"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm font-bold text-slate-700 transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Konten Berita (HTML)</label>
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                  <button onClick={() => insertTag('<b>', '</b>')} className="p-2 hover:bg-white hover:text-emerald-600 rounded-md transition-all text-slate-400" title="Bold"><Bold size={16} /></button>
                  <button onClick={() => insertTag('<i>', '</i>')} className="p-2 hover:bg-white hover:text-emerald-600 rounded-md transition-all text-slate-400" title="Italic"><Italic size={16} /></button>
                  <button onClick={() => insertTag('<blockquote>', '</blockquote>')} className="p-2 hover:bg-white hover:text-emerald-600 rounded-md transition-all text-slate-400" title="Quote"><Quote size={16} /></button>
                  <button onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="p-2 hover:bg-white hover:text-emerald-600 rounded-md transition-all text-slate-400" title="List"><ListIcon size={16} /></button>
                  <button onClick={() => insertTag('<a href="#">', '</a>')} className="p-2 hover:bg-white hover:text-emerald-600 rounded-md transition-all text-slate-400" title="Link"><LinkIcon size={16} /></button>
                  <button onClick={() => insertTag('<br />', '')} className="p-2 hover:bg-white hover:text-emerald-600 rounded-md transition-all text-slate-400" title="Line Break"><Code size={16} /></button>
                </div>
              </div>
              <textarea 
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis konten berita di sini menggunakan tag HTML..."
                className="w-full h-[400px] p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none font-mono text-sm leading-relaxed text-slate-700 transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6 sticky top-28">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Eye size={18} />
                Preview Konten
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 bg-white">
              <article className="prose prose-stone prose-emerald max-w-none">
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    {category}
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
                    {title || 'Judul Berita Akan Muncul di Sini'}
                  </h1>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pb-8 border-b border-slate-100">
                    <span>Oleh: {authorName}</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {imageUrl && (
                  <div className="mb-8 rounded-2xl overflow-hidden aspect-video shadow-lg">
                    <img src={imageUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div 
                  className="text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content || '<p className="text-slate-300 italic">Konten berita akan ter-render di sini secara real-time...</p>' }}
                />
              </article>
            </div>
          </div>
          
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
              <Type size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Tips Menulis</h4>
              <p className="text-xs text-emerald-700/70 leading-relaxed mt-1">
                Gunakan tag HTML untuk memformat teks. Misalnya, gunakan <b>&lt;b&gt;teks&lt;/b&gt;</b> untuk menebalkan kata penting.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
