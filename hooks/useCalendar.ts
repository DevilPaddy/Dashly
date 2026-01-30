import useSWR from 'swr';
import apiClient from '@/app/lib/api-client';
import { CalendarEvent } from '@/types/calendar';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

export const useCalendar = () => {
  const { data, error, mutate } = useSWR('/calendar/events', fetcher);

  const syncCalendar = async (startDate?: Date, endDate?: Date) => {
    await apiClient.post('/calendar/sync', { startDate, endDate });
    mutate();
  };

  const createEvent = async (eventData: any) => {
    const res = await apiClient.post('/calendar/create', eventData);
    mutate();
    return res.data;
  };

  return {
    events: data || [],
    isLoading: !error && !data,
    isError: error,
    syncCalendar,
    createEvent,
    mutate
  };
};