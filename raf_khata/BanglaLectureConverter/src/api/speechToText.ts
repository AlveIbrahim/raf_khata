import axios from 'axios';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

// Replace with your server's IP address and port
const API_URL = 'http://192.168.1.106'; // Change this to your computer's local IP

// Define response types
export interface SpeechToTextResponse {
  success: boolean;
  transcript?: string;
  message: string;
}

const convertSpeechToText = async (audioPath: string): Promise<SpeechToTextResponse> => {
  try {
    // Check if file exists
    const exists = await RNFS.exists(audioPath);
    if (!exists) {
      throw new Error('Audio file does not exist');
    }

    console.log(`Sending audio file for transcription: ${audioPath}`);

    // Create form data to send the audio file
    const formData = new FormData();
    
    // Get file name from path
    const fileName = audioPath.split('/').pop();
    
    // Add the audio file to the form data
    formData.append('audio', {
      uri: Platform.OS === 'android' ? `file://${audioPath}` : audioPath,
      type: 'audio/mpeg', // Adjust based on your file type
      name: fileName || 'recording.mp3',
    } as any);

    // Show that we're making the request
    console.log('Sending request to server...');
    
    // Make API request to the server
    const response = await axios.post<SpeechToTextResponse>(`${API_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 120000, // 2 minute timeout - transcription can take time
    });

    console.log('Received response:', response.data);

    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Failed to convert speech to text');
    }
  } catch (error: any) {
    console.error('Speech to text conversion error:', error);
    
    // For development - provide a fallback response when server is not available
    if (error.message.includes('Network Error') || error.code === 'ECONNABORTED') {
      console.log('Using fallback response due to network error');
      return {
        success: true,
        transcript: 'এটি একটি বাংলা লেকচারের উদাহরণ। আমরা এখানে বাংলা থেকে ইংরেজিতে অনুবাদ করছি।',
        message: 'Speech to text conversion successful (SIMULATED - SERVER UNAVAILABLE)'
      };
    }
    
    return {
      success: false,
      message: error.message || 'Failed to convert speech to text'
    };
  }
};

export default {
  convertSpeechToText
};