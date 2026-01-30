import useSWR from 'swr';
import apiClient from '@/app/lib/api-client';
import { Email, EmailFilters } from '@/types/email';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

export const useEmails = (filters?: EmailFilters) => {
  const queryParams = new URLSearchParams();
  if (filters?.isRead !== undefined) queryParams.append('isRead', filters.isRead.toString());
  if (filters?.isStarred !== undefined) queryParams.append('isStarred', filters.isStarred.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());

  const { data, error, mutate } = useSWR(
    `/emails?${queryParams.toString()}`,
    fetcher
  );

  const updateEmail = async (id: string, updates: Partial<Email>) => {
    const res = await apiClient.patch(`/emails/${id}`, updates);
    mutate();
    return res.data;
  };

  const syncEmails = async () => {
    await apiClient.post('/gmail/sync', { maxResults: 50 });
    mutate();
  };

  const markAsRead = async (gmailId: string, isRead: boolean) => {
    await apiClient.patch('/gmail/read', { gmailId, isRead });
    mutate();
  };

  return {
    emails: data || [],
    isLoading: !error && !data,
    isError: error,
    updateEmail,
    syncEmails,
    markAsRead,
    mutate
  };
};