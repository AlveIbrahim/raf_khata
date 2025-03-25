import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import AudioRecorder from '../components/AudioRecorder';
import {StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Alert } from 'react-native';
type RecordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Record'>;

interface RecordScreenProps {
  navigation: RecordScreenNavigationProp;
}

const RecordScreen: React.FC<RecordScreenProps> = ({navigation}) => {
  const [audioPath, setAudioPath] = useState<string | null>(null);

  const handleRecordingComplete = (path: string) => {
    setAudioPath(path);
  };

  const startProcessing = () => {
    if (audioPath) {
      navigation.navigate('Processing', {audioPath, source: 'recording'});
    } else {
        Alert.alert('Information', 'Please record an audio first');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Record your Bangla lecture by pressing the 'Start Recording' button below.
          You can play back your recording to check it before processing.
        </Text>

        <AudioRecorder onRecordingComplete={handleRecordingComplete} />

        <Button
          mode="contained"
          onPress={startProcessing}
          style={styles.processButton}
          disabled={!audioPath}
          icon="arrow-right"
        >
          Process Recording
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

export default RecordScreen;