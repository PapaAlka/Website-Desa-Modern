import { supabase } from '../lib/supabase';

/**
 * Uploads an image to Supabase Storage
 * @param file The file to upload
 * @param folder The folder in the bucket (e.g., 'news', 'potensi')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  // 1. Check Authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Anda harus masuk menggunakan akun Supabase asli (bukan mock) untuk mengunggah gambar. Silakan buat akun di Dashboard Supabase dan login kembali.');
  }

  // 2. Validation
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    throw new Error('Ukuran file maksimal 2MB.');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Format file harus .jpg, .png, atau .webp.');
  }

  // 3. Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // 4. Upload to 'desa-media' bucket
  const { error: uploadError } = await supabase.storage
    .from('desa-media')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error details:', uploadError);
    if (uploadError.message.includes('row-level security')) {
      throw new Error('Gagal mengunggah: Izin ditolak (RLS). Pastikan Anda sudah menjalankan SQL Policy dan menggunakan akun Supabase asli.');
    }
    if (uploadError.message.includes('not found')) {
      throw new Error('Gagal mengunggah: Bucket "desa-media" tidak ditemukan. Silakan buat bucket bernama "desa-media" di Dashboard Supabase Storage.');
    }
    throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
  }

  // 5. Get Public URL
  const { data } = supabase.storage
    .from('desa-media')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
