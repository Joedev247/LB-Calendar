'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI, eventsAPI, tasksAPI, projectsAPI } from './api';
import toast from 'react-hot-toast';

// Types
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  department?: string;
  avatar_url?: string;
}

interface Event {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  location?: string;
  is_online?: boolean;
  online_platform?: string;
  project_id?: number;
  project_name?: string;
  project_color?: string;
  created_by: number;
  created_by_name?: string;
  created_by_email?: string;
  created_at?: string;
  updated_at?: string;
  hosts?: Array<{
    id?: number;
    user_id?: number;
    name: string;
    email: string;
    role: string;
    is_external?: boolean;
  }>;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  project_id?: number;
  project_name?: string;
  project_color?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_users?: number[];
  assigned_users_names?: Array<{ id: number; name: string; email: string }>;
  created_by: number;
  created_by_name?: string;
  created_by_email?: string;
  created_at?: string;
  updated_at?: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
  created_by: number;
  created_by_name?: string;
  member_count?: number;
  task_count?: number;
  event_count?: number;
}

interface AppState {
  user: User | null;
  events: Event[];
  tasks: Task[];
  projects: Project[];
  loading: boolean;
  error: string | null;
  loadingEvents: boolean;
  loadingTasks: boolean;
  loadingProjects: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING_EVENTS'; payload: boolean }
  | { type: 'SET_LOADING_TASKS'; payload: boolean }
  | { type: 'SET_LOADING_PROJECTS'; payload: boolean }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: number }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: number };

const initialState: AppState = {
  user: null,
  events: [],
  tasks: [],
  projects: [],
  loading: false,
  error: null,
  loadingEvents: false,
  loadingTasks: false,
  loadingProjects: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING_EVENTS':
      return { ...state, loadingEvents: action.payload };
    case 'SET_LOADING_TASKS':
      return { ...state, loadingTasks: action.payload };
    case 'SET_LOADING_PROJECTS':
      return { ...state, loadingProjects: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loadingEvents: false };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loadingTasks: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loadingProjects: false };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, department?: string) => Promise<void>;
  loginWithOAuth: () => Promise<void>;
  handleOAuthCallback: (token: string, email: string) => Promise<void>;
  logout: () => void;
  loadEvents: (params?: any) => Promise<void>;
  createEvent: (data: any) => Promise<void>;
  updateEvent: (id: number, data: any) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  loadTasks: (params?: any) => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTask: (id: number, data: any) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  loadProjects: (params?: any) => Promise<void>;
  createProject: (data: any) => Promise<void>;
  updateProject: (id: number, data: any) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Load initial data when user is set
  useEffect(() => {
    if (state.user) {
      loadEvents();
      loadTasks();
      loadProjects();
    }
  }, [state.user]);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (email: string, password: string, name: string, department?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.register(email, password, name, department);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Registration successful!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loginWithOAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.getOAuthAuthorizeUrl();
      const { authUrl } = response.data;
      
      // Redirect to OAuth provider
      window.location.href = authUrl;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to initiate OAuth login';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const handleOAuthCallback = async (token: string, email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Store token
      localStorage.setItem('token', token);
      
      // Fetch user info using the token
      try {
        const response = await authAPI.getMe();
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'SET_USER', payload: user });
        toast.success('Login successful!');
      } catch (error: any) {
        // If getMe fails, create a minimal user object from email
        const user = {
          id: 0,
          email: email,
          name: email.split('@')[0],
          role: 'user',
        };
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'SET_USER', payload: user });
        toast.success('Login successful!');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to complete OAuth login';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_EVENTS', payload: [] });
    dispatch({ type: 'SET_TASKS', payload: [] });
    dispatch({ type: 'SET_PROJECTS', payload: [] });
    toast.success('Logged out successfully!');
  };

  const loadEvents = useCallback(async (params?: any) => {
    if (state.loadingEvents) return; // Prevent multiple simultaneous requests
    
    try {
      dispatch({ type: 'SET_LOADING_EVENTS', payload: true });
      const response = await eventsAPI.getAll(params);
      dispatch({ type: 'SET_EVENTS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to load events';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING_EVENTS', payload: false });
      toast.error(message);
    }
  }, []); // Remove state.loadingEvents dependency to prevent recreation

  const createEvent = async (data: any) => {
    try {
      const response = await eventsAPI.create(data);
      dispatch({ type: 'ADD_EVENT', payload: response.data });
      toast.success('Event created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create event';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const updateEvent = async (id: number, data: any) => {
    try {
      const response = await eventsAPI.update(id, data);
      dispatch({ type: 'UPDATE_EVENT', payload: response.data });
      toast.success('Event updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update event';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await eventsAPI.delete(id);
      dispatch({ type: 'DELETE_EVENT', payload: id });
      toast.success('Event deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete event';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const loadTasks = useCallback(async (params?: any) => {
    if (state.loadingTasks) return; // Prevent multiple simultaneous requests
    
    try {
      dispatch({ type: 'SET_LOADING_TASKS', payload: true });
      const response = await tasksAPI.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to load tasks';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING_TASKS', payload: false });
      toast.error(message);
    }
  }, []); // Remove state.loadingTasks dependency to prevent recreation

  const createTask = async (data: any) => {
    try {
      const response = await tasksAPI.create(data);
      dispatch({ type: 'ADD_TASK', payload: response.data });
      toast.success('Task created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create task';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const updateTask = async (id: number, data: any) => {
    try {
      const response = await tasksAPI.update(id, data);
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
      toast.success('Task updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update task';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const response = await tasksAPI.toggle(id);
      // Reload tasks to get updated state
      await loadTasks();
      toast.success('Task updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update task';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await tasksAPI.delete(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete task';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const loadProjects = useCallback(async (params?: any) => {
    if (state.loadingProjects) return; // Prevent multiple simultaneous requests
    
    try {
      dispatch({ type: 'SET_LOADING_PROJECTS', payload: true });
      const response = await projectsAPI.getAll(params);
      dispatch({ type: 'SET_PROJECTS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to load projects';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING_PROJECTS', payload: false });
      toast.error(message);
    }
  }, []); // Remove state.loadingProjects dependency to prevent recreation

  const createProject = async (data: any) => {
    try {
      const response = await projectsAPI.create(data);
      dispatch({ type: 'ADD_PROJECT', payload: response.data });
      toast.success('Project created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create project';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const updateProject = async (id: number, data: any) => {
    try {
      const response = await projectsAPI.update(id, data);
      dispatch({ type: 'UPDATE_PROJECT', payload: response.data });
      toast.success('Project updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update project';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await projectsAPI.delete(id);
      dispatch({ type: 'DELETE_PROJECT', payload: id });
      toast.success('Project deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete project';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const value: AppContextType = {
    ...state,
    login,
    register,
    loginWithOAuth,
    handleOAuthCallback,
    logout,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    loadTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
