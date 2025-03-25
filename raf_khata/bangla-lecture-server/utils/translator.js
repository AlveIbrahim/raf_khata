const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const execPromise = util.promisify(exec);

// Path to the NLLB model and scripts
const MODEL_PATH = path.join(__dirname, '../models/nllb');

// Make sure MODEL_PATH exists
if (!fs.existsSync(MODEL_PATH)) {
  fs.mkdirSync(MODEL_PATH, { recursive: true });
}

/**
 * Translates text using Meta's NLLB model
 * 
 * @param {string} text Text to translate
 * @param {string} sourceLang Source language code (default: 'bn' for Bangla)
 * @param {string} targetLang Target language code (default: 'en' for English)
 * @returns {Promise<string>} Translated text
 */
async function translateText(text, sourceLang = 'bn', targetLang = 'en') {
  try {
    // For a production implementation, you'd need to set up NLLB properly
    // Here, we're showing a simple approach using Python and the transformers package
    
    // Save text to a temporary file
    const tempInputPath = path.join(__dirname, '../uploads/temp_input.txt');
    fs.writeFileSync(tempInputPath, text);
    
    // Command to run NLLB (you need to have Python and transformers installed)
    const command = `python -c "from transformers import AutoModelForSeq2SeqLM, AutoTokenizer; tokenizer = AutoTokenizer.from_pretrained('facebook/nllb-200-distilled-600M'); model = AutoModelForSeq2SeqLM.from_pretrained('facebook/nllb-200-distilled-600M'); with open('${tempInputPath}', 'r', encoding='utf-8') as f: text = f.read(); inputs = tokenizer(text, return_tensors='pt', src_lang='${sourceLang}_Beng'); translated_tokens = model.generate(**inputs, forced_bos_token_id=tokenizer.lang_code_to_id['${targetLang}_Latn'], max_length=200); translation = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]; print(translation)"`;

    console.log(`Executing command: ${command}`);
    
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error(`NLLB stderr: ${stderr}`);
    }
    
    // Clean up temp file
    fs.unlinkSync(tempInputPath);
    
    // Return the translated text
    return stdout.trim();
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Failed to translate text: ' + error.message);
  }
}

module.exports = {
  translateText
};