// controllers/fileController.js - File Controller

const File = require('../models/File');
const Folder = require('../models/Folder');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload File
exports.uploadFile = async (req, res) => {
    try {
        console.log('Upload request body:', req.body);
        console.log('Upload file:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { Name, Folder: folderId, Visibility, ownerEmail } = req.body;
        const filePath = req.file.path;

        // Validate required fields
        if (!Name || !folderId || !ownerEmail) {
            return res.status(400).json({
                message: 'Missing required fields: Name, Folder, or ownerEmail'
            });
        }

        const lastFile = await File.findOne().sort({ id: -1 });
        const newId = lastFile ? lastFile.id + 1 : 1;

        const newFile = new File({
            Name,
            Folder: parseInt(folderId),
            id: newId,
            Visibility: Visibility === 'true' || Visibility === true,
            filePath,
            ownerEmail
        });

        await newFile.save();

        // Update folder file count
        await Folder.findOneAndUpdate(
            { id: parseInt(folderId) },
            { $inc: { File: 1 } }
        );

        res.status(201).json({ message: 'File uploaded', file: newFile });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get Files by Folder
exports.getFilesByFolder = async (req, res) => {
    try {
        const { folderId, ownerEmail } = req.query;

        const files = await File.find({
            Folder: parseInt(folderId),
            $or: [
                { ownerEmail: ownerEmail },
                { Visibility: true }
            ]
        });

        res.status(200).json(files);
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Search Files
exports.searchFiles = async (req, res) => {
    try {
        const { query, ownerEmail } = req.query;

        const files = await File.find({
            Name: { $regex: query, $options: 'i' },
            $or: [
                { ownerEmail: ownerEmail },
                { Visibility: true }
            ]
        });

        res.status(200).json(files);
    } catch (error) {
        console.error('Search files error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete File
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        const file = await File.findOne({ id: parseInt(id) });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete physical file
        if (fs.existsSync(file.filePath)) {
            fs.unlinkSync(file.filePath);
        }

        await Folder.findOneAndUpdate(
            { id: file.Folder },
            { $inc: { File: -1 } }
        );

        await File.findOneAndDelete({ id: parseInt(id) });
        res.status(200).json({ message: 'File deleted' });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ message: error.message });
    }
};
// controllers/fileController.js - Add this function

// Download File
exports.downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findOne({ id: parseInt(id) });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(__dirname, '..', file.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(filePath, file.Name);
    } catch (error) {
        console.error('Download file error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.upload = upload;