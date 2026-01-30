import useSWR from 'swr';
import apiClient from '@/app/lib/api-client';
import { Note, CreateNoteDTO } from '@/types/note';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

export const useNotes = (tag?: string) => {
  const queryParams = new URLSearchParams();
  if (tag) queryParams.append('tag', tag);

  const { data, error, mutate } = useSWR(
    `/notes?${queryParams.toString()}`,
    fetcher
  );

  const createNote = async (noteData: CreateNoteDTO) => {
    const res = await apiClient.post('/notes', noteData);
    mutate(); // Revalidate
    return res.data;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const res = await apiClient.patch(`/notes/${id}`, updates);
    mutate();
    return res.data;
  };

  const deleteNote = async (id: string) => {
    await apiClient.delete(`/notes/${id}`);
    mutate();
  };

  return {
    notes: data || [],
    isLoading: !error && !data,
    isError: error,
    createNote,
    updateNote,
    deleteNote,
    mutate
  };
};