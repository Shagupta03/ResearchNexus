const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');  // ← ADD THIS if not already there
const previewController = require('../controllers/previewController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/send', upload.single('file'), previewController.sendWork);
router.get('/professor/:professor_email', previewController.getProfessorPreviews);
router.post('/feedback', previewController.giveFeedback);
router.get('/student/:student_email', previewController.getStudentFeedback);

// ← ADD THIS NEW ROUTE
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    console.log('Download request for:', filename);
    console.log('File path:', filePath);

    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(404).json({ message: 'File not found' });
        }
    });
});

module.exports = router;