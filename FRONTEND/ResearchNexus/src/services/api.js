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

// UPDATED: ownerGroupId instead of ownerEmail
export const getFolders = (ownerGroupId) => {
    return api.get('/folders', { params: { ownerGroupId } });
};

export const updateFolder = (id, data) => {
    return api.put(`/folders/${id}`, data);
};

// UPDATED: ownerGroupId instead of ownerEmail
export const searchFolders = (query, ownerGroupId) => {
    return api.get('/folders/search', { params: { query, ownerGroupId } });
};

export const deleteFolder = (id) => {
    return api.delete(`/folders/${id}`);
};

// File APIs
export const uploadFile = (formData) => {
    return api.post('/files', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// UPDATED: ownerGroupId instead of ownerEmail
export const getFilesByFolder = (folderId, ownerGroupId) => {
    return api.get('/files', { params: { folderId, ownerGroupId } });
};

// UPDATED: ownerGroupId instead of ownerEmail
export const searchFiles = (query, ownerGroupId) => {
    return api.get('/files/search', { params: { query, ownerGroupId } });
};

export const deleteFile = (id) => {
    return api.delete(`/files/${id}`);
};

export default api;
