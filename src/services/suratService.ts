import { supabase } from '../lib/supabase';
import { SuratRequest } from '../types';

export const getSuratRequests = async () => {
  const { data, error } = await supabase
    .from('surat_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SuratRequest[];
};

export const updateSuratStatus = async (id: string, status: 'Pending' | 'Diproses' | 'Selesai' | 'Ditolak') => {
  const { data, error } = await supabase
    .from('surat_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as SuratRequest;
};

export const deleteSuratRequest = async (id: string) => {
  const { error } = await supabase
    .from('surat_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const createSuratRequest = async (request: Omit<SuratRequest, 'id' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('surat_requests')
    .insert([{ ...request, status: 'Pending' }])
    .select()
    .single();

  if (error) throw error;
  return data as SuratRequest;
};

export const trackSuratByNik = async (nik: string) => {
  const { data, error } = await supabase
    .from('surat_requests')
    .select('*')
    .eq('nik', nik)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SuratRequest[];
};
