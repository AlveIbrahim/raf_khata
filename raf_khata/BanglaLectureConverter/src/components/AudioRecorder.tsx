import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {Button} from 'react-native-paper';
import { Alert } from 'react-native';

interface AudioRecorderProps {
  onRecordingComplete: (path: string) => void;
}

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder: React.FC<AudioRecorderProps> = ({onRecordingComplete}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<string>('00:00:00');
  const [recordSecs, setRecordSecs] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<string>('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState<number>(0);
  const [playTime, setPlayTime] = useState<string>('00:00:00');
  const [duration, setDuration] = useState<string>('00:00:00');
  const [audioPath, setAudioPath] = useState<string>('');

  useEffect(() => {
    return () => {
      // Cleanup
      if (isRecording) {
        audioRecorderPlayer.stopRecorder();
      }
      if (isPlaying) {
        audioRecorderPlayer.stopPlayer();
      }
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [isRecording, isPlaying]);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        const permissionsGranted =
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED;

        return permissionsGranted;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS handles permissions differently
    }
  };

  const onStartRecord = async (): Promise<void> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Please grant audio recording permissions to use this feature.');
      return;
    }

    const path = Platform.select({
      ios: 'lecture.m4a',
      android: `${RNFS.ExternalDirectoryPath}/lecture.mp3`,
    });

    if (!path) {
      Alert.alert('Error: Could not determine file path');
      return;
    }

    const result = await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    setIsRecording(true);
    setAudioPath(result);
  };

  const onStopRecord = async (): Promise<void> => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    onRecordingComplete(audioPath);
  };

  const onStartPlay = async (): Promise<void> => {
    try {
      const msg = await audioRecorderPlayer.startPlayer(audioPath);
      console.log(msg);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentPositionSec(e.currentPosition);
        setCurrentPosition(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        );
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          setIsPlaying(false);
        }
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const onPausePlay = async (): Promise<void> => {
    await audioRecorderPlayer.pausePlayer();
    setIsPlaying(false);
  };

  const onStopPlay = async (): Promise<void> => {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingTime}>
          {isRecording ? recordTime : playTime}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        {!isRecording && !isPlaying && audioPath === '' && (
          <Button 
            mode="contained" 
            onPress={onStartRecord} 
            style={styles.button}
            icon="microphone"
          >
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button 
            mode="contained" 
            onPress={onStopRecord} 
            style={[styles.button, {backgroundColor: '#D32F2F'}]}
            icon="stop"
          >
            Stop Recording
          </Button>
        )}

        {!isRecording && audioPath !== '' && !isPlaying && (
          <>
            <Button 
              mode="contained" 
              onPress={onStartPlay} 
              style={[styles.button, {marginRight: 10}]}
              icon="play"
            >
              Play
            </Button>
            <Button 
              mode="contained" 
              onPress={onStartRecord} 
              style={styles.button}
              icon="microphone"
            >
              Re-record
            </Button>
          </>
        )}

        {isPlaying && (
          <>
            <Button 
              mode="contained" 
              onPress={onPausePlay} 
              style={[styles.button, {marginRight: 10}]}
              icon="pause"
            >
              Pause
            </Button>
            <Button 
              mode="contained" 
              onPress={onStopPlay} 
              style={[styles.button, {backgroundColor: '#D32F2F'}]}
              icon="stop"
            >
              Stop
            </Button>
          </>
        )}
      </View>
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
  recordingInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 10,
  },
});

export default AudioRecorder;