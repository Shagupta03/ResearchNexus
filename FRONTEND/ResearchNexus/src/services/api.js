// src/services/api.js - API Service using Axios
import axios from 'axios';

const API_URL = 'http://localhost:9222/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const login = (email, userType) => {
  return api.post('/auth/login', { email, userType });
};

export const registerSupervisor = (data) => {
  return api.post('/auth/register/supervisor', data);
};

export const registerStudent = (data) => {
  return api.post('/auth/register/student', data);
};

// Folder APIs
export const createFolder = (data) => {
  return api.post('/folders', data);
};

export const getFolders = (ownerEmail) => {
  return api.get('/folders', { params: { ownerEmail } });
};

export const updateFolder = (id, data) => {
  return api.put(`/folders/${id}`, data);  // FIXED: Changed backticks to parentheses
};

export const searchFolders = (query, ownerEmail) => {
  return api.get('/folders/search', { params: { query, ownerEmail } });
};

export const deleteFolder = (id) => {
  return api.delete(`/folders/${id}`);  // FIXED: Changed backticks to parentheses
};

// File APIs
export const uploadFile = (formData) => {
  return api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getFilesByFolder = (folderId, ownerEmail) => {
  return api.get('/files', { params: { folderId, ownerEmail } });
};

export const searchFiles = (query, ownerEmail) => {
  return api.get('/files/search', { params: { query, ownerEmail } });
};

export const deleteFile = (id) => {
  return api.delete(`/files/${id}`);  // FIXED: Changed backticks to parentheses
};

// ============= TASK & PROGRESS APIs =============

// Task APIs
export const assignTask = (taskData) => 
  api.post('/tasks/assign', taskData);

export const getTasksByGroup = (groupId) => 
  api.get(`/tasks/group/${groupId}`);  // FIXED: Changed backticks to parentheses

// Progress APIs
export const updateProgress = (progressData) => 
  api.post('/progress/update', progressData);

export const getProgress = (groupId, studentEmail) => 
  api.get(`/progress/${groupId}/${studentEmail}`);  // FIXED: Changed backticks to parentheses

// ============= PREVIEW/FEEDBACK APIs =============

// Preview APIs
export const sendWorkForPreview = (formData) => 
  api.post('/preview/send', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getProfessorPreviews = (professorEmail) => 
  api.get(`/preview/professor/${professorEmail}`);  // FIXED: Changed backticks to parentheses

export const giveFeedback = (feedbackData) => 
  api.post('/preview/feedback', feedbackData);

export const getStudentFeedback = (studentEmail) => 
  api.get(`/preview/student/${studentEmail}`);  // FIXED: Changed backticks to parentheses

// ============= AUTH APIs =============

export const loginStudent = (credentials) => 
  api.post('/auth/student/login', credentials);

export const loginSupervisor = (credentials) => 
  api.post('/auth/supervisor/login', credentials);

export default api;