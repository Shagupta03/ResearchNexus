// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import {
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder,
    searchFolders,
    uploadFile,
    getFilesByFolder,
    searchFiles,
    deleteFile
} from '../services/api';

import '../styles/Dashboard.css';

function Dashboard({ user, userType, onLogout }) {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showUploadFile, setShowUploadFile] = useState(false);
    const [showEditFolder, setShowEditFolder] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [folderName, setFolderName] = useState('');
    const [folderVisibility, setFolderVisibility] = useState(true);

    const [editingFolder, setEditingFolder] = useState(null);
    const [editFolderName, setEditFolderName] = useState('');
    const [editFolderVisibility, setEditFolderVisibility] = useState(true);

    const [fileName, setFileName] = useState('');
    const [fileVisibility, setFileVisibility] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadFolders();
    }, []);

    const loadFolders = async () => {
        try {
            const response = await getFolders(user.GroupId);
            setFolders(response.data);
        } catch (error) {
            console.error('Error loading folders:', error);
        }
    };

    const loadFiles = async (folderId) => {
        try {
            const response = await getFilesByFolder(folderId, user.GroupId);
            setFiles(response.data);
        } catch (error) {
            console.error('Error loading files:', error);
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            await createFolder({
                Name: folderName,
                Visibility: folderVisibility,
                ownerGroupId: user.GroupId
            });
            setFolderName('');
            setShowCreateFolder(false);
            loadFolders();
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const handleUploadFile = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('Name', fileName);
            formData.append('Folder', selectedFolder.id);
            formData.append('Visibility', fileVisibility);
            formData.append('ownerGroupId', user.GroupId);
            formData.append('file', selectedFile);

            await uploadFile(formData);
            setFileName('');
            setSelectedFile(null);
            setShowUploadFile(false);
            loadFiles(selectedFolder.id);
            loadFolders();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadFolders();
            setSelectedFolder(null);
            setFiles([]);
            return;
        }
        try {
            const folderResponse = await searchFolders(searchQuery, user.GroupId);
            const fileResponse = await searchFiles(searchQuery, user.GroupId);

            setFolders(folderResponse.data);

            if (fileResponse.data.length > 0) {
                setFiles(fileResponse.data);
                setSelectedFolder({ Name: 'Search Results', id: 'search' });
            } else {
                setFiles([]);
                setSelectedFolder(null);
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleDeleteFolder = async (id) => {
        if (window.confirm('Delete this folder?')) {
            try {
                await deleteFolder(id);
                loadFolders();
                setSelectedFolder(null);
                setFiles([]);
            } catch (error) {
                console.error('Error deleting folder:', error);
            }
        }
    };

    const handleEditFolder = (folder) => {
        setEditingFolder(folder);
        setEditFolderName(folder.Name);
        setEditFolderVisibility(folder.Visibility);
        setShowEditFolder(true);
    };

    const handleUpdateFolder = async (e) => {
        e.preventDefault();
        try {
            await updateFolder(editingFolder.id, {
                Name: editFolderName,
                Visibility: editFolderVisibility
            });
            setShowEditFolder(false);
            loadFolders();
            if (selectedFolder && selectedFolder.id === editingFolder.id) {
                setSelectedFolder({
                    ...editingFolder,
                    Name: editFolderName,
                    Visibility: editFolderVisibility
                });
            }
        } catch (error) {
            console.error('Error updating folder:', error);
        }
    };

    const handleDownloadFile = (fileId) => {
        window.open(`http://localhost:9222/api/files/download/${fileId}`, '_blank');
    };

    const handleDeleteFile = async (id) => {
        if (window.confirm('Delete this file?')) {
            try {
                await deleteFile(id);
                loadFiles(selectedFolder.id);
                loadFolders();
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
    };

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
        loadFiles(folder.id);
    };

    return (
        <div className="dashboard-wrapper">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h2>File Management System</h2>
                    <p>Welcome, {user.Name} ({userType})</p>
                </div>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={() => setShowCreateFolder(true)}>New Folder</button>

                {selectedFolder && (
                    <button onClick={() => setShowUploadFile(true)}>Upload File</button>
                )}
            </div>

            <div className="main-content">

                {/* Folder List */}
                <div className="folder-list">
                    <h3>Folders</h3>
                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            className={`folder-item ${selectedFolder?.id === folder.id ? 'active' : ''}`}
                            onClick={() => handleFolderClick(folder)}
                        >
                            <div className="folder-info">
                                <div className="folder-name">📁 {folder.Name}</div>
                                <div className="folder-meta">
                                    {folder.File} files • {folder.Visibility ? "🌐 Public" : "🔒 Private"}
                                </div>
                            </div>

                            {folder.ownerGroupId === user.GroupId && (
                                <div className="folder-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={(e) => { e.stopPropagation(); handleEditFolder(folder); }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* File List */}
                <div className="file-list">
                    {selectedFolder ? (
                        <>
                            <h3>Files in "{selectedFolder.Name}"</h3>

                            <div className="file-grid">
                                {files.map(file => (
                                    <div className="file-card" key={file.id}>
                                        <div className="file-icon">📄</div>
                                        <div className="file-name">{file.Name}</div>
                                        <div className="file-meta">
                                            {file.Visibility ? "🌐 Public" : "🔒 Private"}
                                        </div>

                                        <div className="file-actions">
                                            <button className="download-btn"
                                                onClick={() => handleDownloadFile(file.id)}
                                            >
                                                Download
                                            </button>

                                            {file.ownerGroupId === user.GroupId && (
                                                <button className="delete-btn"
                                                    onClick={() => handleDeleteFile(file.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-message">
                            Select a folder to view files
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateFolder && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Create New Folder</h3>
                        <form onSubmit={handleCreateFolder}>
                            <label>Folder Name</label>
                            <input
                                type="text"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                required
                            />

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={folderVisibility}
                                    onChange={(e) => setFolderVisibility(e.target.checked)}
                                />
                                Public Folder
                            </label>

                            <div className="modal-buttons">
                                <button className="confirm-btn" type="submit">Create</button>
                                <button className="cancel-btn" type="button"
                                    onClick={() => setShowCreateFolder(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUploadFile && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Upload File</h3>
                        <form onSubmit={handleUploadFile}>
                            <label>File Name</label>
                            <input
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                required
                            />

                            <label>Select File</label>
                            <input
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                required
                            />

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={fileVisibility}
                                    onChange={(e) => setFileVisibility(e.target.checked)}
                                />
                                Public File
                            </label>

                            <div className="modal-buttons">
                                <button className="confirm-btn" type="submit">Upload</button>
                                <button className="cancel-btn" type="button"
                                    onClick={() => setShowUploadFile(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditFolder && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Edit Folder</h3>
                        <form onSubmit={handleUpdateFolder}>
                            <label>Folder Name</label>
                            <input
                                type="text"
                                value={editFolderName}
                                onChange={(e) => setEditFolderName(e.target.value)}
                                required
                            />

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={editFolderVisibility}
                                    onChange={(e) => setEditFolderVisibility(e.target.checked)}
                                />
                                Public Folder
                            </label>

                            <div className="modal-buttons">
                                <button className="confirm-btn" type="submit">Update</button>
                                <button className="cancel-btn" type="button"
                                    onClick={() => setShowEditFolder(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Dashboard;
