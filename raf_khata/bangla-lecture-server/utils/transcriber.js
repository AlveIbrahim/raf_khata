const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

// Path to the Whisper model and scripts
const MODEL_PATH = path.join(__dirname, '../models/whisper');

// Make sure MODEL_PATH exists
if (!fs.existsSync(MODEL_PATH)) {
  fs.mkdirSync(MODEL_PATH, { recursive: true });
}

/**
 * Transcribes audio using OpenAI's Whisper model
 * 
 * @param {string} audioFilePath Path to the audio file
 * @returns {Promise<string>} Transcription result
 */
async function transcribeAudio(audioFilePath) {
  try {
    // For a production implementation, you'd need to set up Whisper properly
    // Here, we're showing a simple approach using Python and the Whisper package
    
    // Command to run Whisper (you need to have Python and Whisper installed)
    const command = `python -c "import whisper; model = whisper.load_model('small'); result = model.transcribe('${audioFilePath}', language='bn'); print(result['text'])"`;

    console.log(`Executing command: ${command}`);
    
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error(`Whisper stderr: ${stderr}`);
    }
    
    // Return the transcript
    return stdout.trim();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio: ' + error.message);
  }
}

module.exports = {
  transcribeAudio
};