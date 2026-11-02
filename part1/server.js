const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

const app = express();
const PORT = 3000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null,uploadDir),
    filename: (req,file,cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g,'_');
        cb(null, Date.now() + '-' + safeName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 20*1024*1024},
    fileFilter: (req,file,cb) => {
        if  (filemimetype === 'application/pdf') cb(null,true);
        else cb(new Error('Only PDF files are allowed'));
    
    }
});

app.use(express.static(__dirname));

app.post('/upload', upload.single('PDF'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No file received'});
    }
    console.log('New order:', {
        file: req.file.fieldname,
        size: req.body.size,
        finish: req.body.finish,
        copies: req.body.copies
    });
    res.json({ message: 'upload successful', file: req.file.fieldname});
});

app.use((err,req,res,next) => {
    res.status(400).json({error: err.message});
});

app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
});