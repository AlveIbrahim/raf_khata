import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

// Define the interface for file picker results
interface FilePickerResult {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface FileUploaderProps {
  onFileSelected: (file: FilePickerResult) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({onFileSelected}) => {
  const [selectedFile, setSelectedFile] = useState<FilePickerResult | null>(null);

  const selectFile = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      // Convert the document picker result to our interface
      const fileResult: FilePickerResult = {
        uri: result[0].uri,
        name: result[0].name || 'unnamed_file',
        type: result[0].type || 'audio/unknown',
        size: result[0].size || 0,
      };

      setSelectedFile(fileResult);
      onFileSelected(fileResult);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled file picker');
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Error selecting file. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={selectFile} 
        icon="file-upload"
        style={styles.button}
      >
        Select Audio File
      </Button>
      {selectedFile && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>
            Selected: {selectedFile.name}
          </Text>
          <Text style={styles.fileSize}>
            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    marginBottom: 15,
  },
  fileInfo: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  fileName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fileSize: {
    color: '#666',
  },
});

export default FileUploader;