// Server configuration
export const SERVER_CONFIG = {
    // Replace this with your computer's IP address on your local network
    // You can find this by running 'ipconfig' on Windows or 'ifconfig' on Mac/Linux
    BASE_URL: 'http://192.168.1.106',
    
    // Timeouts (in milliseconds)
    TIMEOUTS: {
      TRANSCRIPTION: 120000, // 2 minutes
      TRANSLATION: 60000,    // 1 minute
      NOTE_GENERATION: 60000 // 1 minute
    }
  };
  
  // Feature flags
  export const FEATURES = {
    // Set to true if you want to use fallback responses when server isn't available
    USE_FALLBACKS: true,
    
    // Set to true to enable more verbose logging
    DEBUG_MODE: true
  };