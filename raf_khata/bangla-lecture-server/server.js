const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { transcribeAudio } = require('./utils/transcriber');
const { translateText } = require('./utils/translator');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No audio file uploaded' 
      });
    }

    const audioFilePath = req.file.path;
    console.log(`Processing audio file: ${audioFilePath}`);

    // Call the Whisper transcription function
    const transcription = await transcribeAudio(audioFilePath);
    
    // Delete the file after processing
    fs.unlinkSync(audioFilePath);

    res.json({
      success: true,
      transcript: transcription,
      message: 'Speech to text conversion successful'
    });
  } catch (error) {
    console.error('Error in transcription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process audio'
    });
  }
});

app.post('/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'No text provided for translation'
      });
    }

    console.log(`Translating text from ${sourceLang} to ${targetLang}`);
    
    // Call the NLLB translation function
    const translatedText = await translateText(text, sourceLang, targetLang);
    
    res.json({
      success: true,
      translatedText,
      message: 'Translation successful'
    });
  } catch (error) {
    console.error('Error in translation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to translate text'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});