import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, BackHandler, Alert} from 'react-native';
import ProcessingIndicator from '../components/ProcessingIndicator';
import speechToTextApi from '../api/speechToText';
import translatorApi from '../api/translator';
import noteGeneratorApi from '../api/noteGenerator';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ProcessingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Processing'>;
type ProcessingScreenRouteProp = RouteProp<RootStackParamList, 'Processing'>;

interface ProcessingScreenProps {
  navigation: ProcessingScreenNavigationProp;
  route: ProcessingScreenRouteProp;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({navigation, route}) => {
  const {audioPath, source, fileName} = route.params;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [status, setStatus] = useState<string>('Starting speech recognition...');
  const [transcript, setTranscript] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const stepNames = [
    'Speech to Text Conversion',
    'Bangla to English Translation',
    'English Notes Generation',
  ];

  useEffect(() => {
    // Handle back button press - prevent accidental cancellation
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Processing in Progress',
        'Are you sure you want to cancel the processing?',
        [
          {text: 'Continue Processing', style: 'cancel', onPress: () => {}},
          {text: 'Cancel Processing', style: 'destructive', onPress: () => navigation.goBack()},
        ]
      );
      return true;
    });

    // Start the processing pipeline
    processAudio();

    return () => backHandler.remove();
  }, []);

  const processAudio = async (): Promise<void> => {
    try {
      // Step 1: Speech to Text
      setStatus('Converting speech to text...');
      const speechResult = await speechToTextApi.convertSpeechToText(audioPath);
      
      if (!speechResult.success) {
        throw new Error(speechResult.message || 'Failed to convert speech to text');
      }
      
      setTranscript(speechResult.transcript || '');
      setCurrentStep(2);
      
      // Step 2: Translation
      setStatus('Translating from Bangla to English...');
      const translationResult = await translatorApi.translateText(speechResult.transcript || '');
      
      if (!translationResult.success) {
        throw new Error(translationResult.message || 'Failed to translate text');
      }
      
      setTranslatedText(translationResult.translatedText || '');
      setCurrentStep(3);
      
      // Step 3: Note Generation
      setStatus('Generating notes from translated text...');
      const notesResult = await noteGeneratorApi.generateNotes(translationResult.translatedText || '');
      
      if (!notesResult.success) {
        throw new Error(notesResult.message || 'Failed to generate notes');
      }
      
      setNotes(notesResult.notes || '');
      
      // Processing complete, navigate to results
      navigation.replace('Result', {
        notes: notesResult.notes || '',
        originalTranscript: speechResult.transcript || '',
        translatedText: translationResult.translatedText || '',
      });
      
    } catch (error: any) {
      console.error('Processing error:', error);
      Alert.alert(
        'Processing Error',
        `An error occurred: ${error.message}`,
        [{text: 'OK', onPress: () => navigation.goBack()}]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Processing {source === 'upload' ? fileName : 'Recording'}
      </Text>
      
      <Text style={styles.infoText}>
        Please do not close the app or navigate away from this screen.
        Processing may take a few minutes depending on the length of the lecture.
      </Text>
      
      <ProcessingIndicator
        currentStep={currentStep}
        totalSteps={stepNames.length}
        stepNames={stepNames}
        status={status}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#666',
  },
});

export default ProcessingScreen;