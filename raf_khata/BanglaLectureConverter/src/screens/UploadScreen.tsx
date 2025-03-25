import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import FileUploader from '../components/FileUploader';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

// Define FilePickerResult interface to use instead of DocumentPickerResponse
interface FilePickerResult {
  uri: string;
  name: string;
  type: string;
  size: number;
  fileCopyUri?: string;
}

type UploadScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Upload'>;

interface UploadScreenProps {
  navigation: UploadScreenNavigationProp;
}

const UploadScreen: React.FC<UploadScreenProps> = ({navigation}) => {
  // Use FilePickerResult instead of DocumentPickerResponse
  const [selectedFile, setSelectedFile] = useState<FilePickerResult | null>(null);

  // Update this to use FilePickerResult
  const handleFileSelected = (file: FilePickerResult) => {
    setSelectedFile(file);
  };

  const startProcessing = () => {
    if (selectedFile) {
      navigation.navigate('Processing', {
        audioPath: selectedFile.uri,
        source: 'upload' as const,
        fileName: selectedFile.name,
      });
    } else {
      Alert.alert('Information', 'Please select an audio file first');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Upload a Bangla lecture audio file to convert it to English notes.
          The app supports various audio formats including MP3, WAV, and M4A.
        </Text>

        <FileUploader onFileSelected={handleFileSelected} />

        <Button
          mode="contained"
          onPress={startProcessing}
          style={styles.processButton}
          disabled={!selectedFile}
          icon="arrow-right"
        >
          Process File
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#333',
  },
  processButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default UploadScreen;