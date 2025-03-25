import {Platform} from 'react-native';

// Format timestamp to readable format
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Get platform-specific directory path
export const getDirectoryPath = (): string => {
  return Platform.select({
    ios: '',
    android: '/storage/emulated/0/Download/',
  }) || '';
};

// Generate a unique ID based on timestamp
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Parse file name from path
export const getFileNameFromPath = (path: string | null): string => {
  if (!path) return '';
  return path.split('/').pop() || '';
};