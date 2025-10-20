import { api } from './client'
import type { Task } from '../types'

export const fetchTasks = () => api.get<Task[]>('/tasks')

export const fetchTaskById = (id: string) => api.get<Task>('/tasks', { params: { id } })

export const fetchTaskByName = (name: string) => api.get<Task[]>(`/tasks/name/${encodeURIComponent(name)}`)

export const createTask = (task: Task) => api.put<Task>('/tasks', task)

export const deleteTask = (id: string) => api.delete(`/tasks/${id}`)

export const executeTask = (id: string) => api.put<Task>(`/tasks/execute/${id}`)
