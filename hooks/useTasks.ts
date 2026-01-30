import useSWR from 'swr';
import apiClient from '@/app/lib/api-client';
import { Task, CreateTaskDTO, TaskFilters } from '@/types/task';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

export const useTasks = (filters?: TaskFilters) => {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.priority) queryParams.append('priority', filters.priority);
  if (filters?.tag) queryParams.append('tag', filters.tag);

  const { data, error, mutate } = useSWR(
    `/tasks?${queryParams.toString()}`,
    fetcher
  );

  const createTask = async (taskData: CreateTaskDTO) => {
    const res = await apiClient.post('/tasks', taskData);
    mutate(); // Revalidate
    return res.data;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const res = await apiClient.patch(`/tasks/${id}`, updates);
    mutate();
    return res.data;
  };

  const deleteTask = async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
    mutate();
  };

  return {
    tasks: data || [],
    isLoading: !error && !data,
    isError: error,
    createTask,
    updateTask,
    deleteTask,
    mutate
  };
};