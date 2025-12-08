const Folder = require('../models/Folder');

// Create Folder
exports.createFolder = async (req, res) => {
    try {
        const { Name, Visibility, ownerGroupId } = req.body;

        const lastFolder = await Folder.findOne().sort({ id: -1 });
        const newId = lastFolder ? lastFolder.id + 1 : 1;

        const newFolder = new Folder({
            Name,
            id: newId,
            Visibility,
            ownerGroupId
        });

        await newFolder.save();
        res.status(201).json({ message: 'Folder created', folder: newFolder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Folders
exports.getFolders = async (req, res) => {
    try {
        const { ownerGroupId } = req.query;

        const folders = await Folder.find({
            $or: [
                { ownerGroupId: parseInt(ownerGroupId) },
                { Visibility: true }
            ]
        });

        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Folder Name
exports.updateFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Visibility } = req.body;

        const updatedFolder = await Folder.findOneAndUpdate(
            { id: parseInt(id) },
            { Name, Visibility },
            { new: true }
        );

        res.status(200).json({ message: 'Folder updated', folder: updatedFolder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search Folders
exports.searchFolders = async (req, res) => {
    try {
        const { query, ownerGroupId } = req.query;

        const folders = await Folder.find({
            Name: { $regex: query, $options: 'i' },
            $or: [
                { ownerGroupId: parseInt(ownerGroupId) },
                { Visibility: true }
            ]
        });

        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Folder
exports.deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;

        await Folder.findOneAndDelete({ id: parseInt(id) });
        res.status(200).json({ message: 'Folder deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
