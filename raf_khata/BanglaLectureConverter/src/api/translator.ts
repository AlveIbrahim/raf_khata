import axios from 'axios';

// Replace with your server's IP address and port
const API_URL = 'http://192.168.1.106'; // Change this to your computer's local IP

// Define response types
export interface TranslationResponse {
  success: boolean;
  translatedText?: string;
  message: string;
}

const translateText = async (
  text: string, 
  sourceLang: string = 'bn', 
  targetLang: string = 'en'
): Promise<TranslationResponse> => {
  try {
    console.log(`Translating text from ${sourceLang} to ${targetLang}: "${text.substring(0, 50)}..."`);
    
    // Make API request to the server
    const response = await axios.post<TranslationResponse>(`${API_URL}/translate`, {
      text,
      sourceLang,
      targetLang
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 1 minute timeout
    });

    console.log('Received translation response');

    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Failed to translate text');
    }
  } catch (error: any) {
    console.error('Translation error:', error);
    
    // For development - provide a fallback response when server is not available
    if (error.message.includes('Network Error') || error.code === 'ECONNABORTED') {
      console.log('Using fallback response due to network error');
      return {
        success: true,
        translatedText: 'This is an example of a Bangla lecture. We are translating from Bangla to English here.',
        message: 'Translation successful (SIMULATED - SERVER UNAVAILABLE)'
      };
    }
    
    return {
      success: false,
      message: error.message || 'Failed to translate text'
    };
  }
};

export default {
  translateText
};